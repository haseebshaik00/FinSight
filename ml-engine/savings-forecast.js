const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const income = 3000;

// Step 1: Load and parse JSON
let transactions;
try {
  const raw = fs.readFileSync('mock_expenses.json');
  transactions = JSON.parse(raw);
} catch (err) {
  console.error("❌ Failed to read or parse 'mock_expenses.json':", err.message);
  process.exit(1);
}

// Step 2: Group transactions by month
const grouped = {};
transactions.forEach(({ date, amount }) => {
  const month = date.slice(0, 7); // 'YYYY-MM'
  grouped[month] = (grouped[month] || 0) + amount;
});

const sortedMonths = Object.keys(grouped).sort();
const expenses = sortedMonths.map((month) => grouped[month]);

if (expenses.length < 2) {
  console.error("❌ Not enough data to train the model. Need at least 2 months.");
  process.exit(1);
}

// Step 3: Prepare training data (last N-1 as X, next N-1 as Y)
const xs = tf.tensor1d(expenses.slice(0, -1));
const ys = tf.tensor1d(expenses.slice(1));

// Step 4: Define and train model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [1], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 }));
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

(async () => {
  console.log("📈 Training model on", expenses.length, "months of data...");

  await model.fit(xs.reshape([-1, 1]), ys.reshape([-1, 1]), {
    epochs: 200,
    verbose: 0,
  });

  console.log("✅ Model training complete!");

  // Step 5: Forecast next 6 months
  let last = expenses[expenses.length - 1];
  const futureExpenses = [];

  for (let i = 0; i < 6; i++) {
    const input = tf.tensor2d([[last]]);
    const prediction = model.predict(input);
    const predictedExpense = prediction.dataSync()[0];
    futureExpenses.push(predictedExpense);
    last = predictedExpense;
  }

  const predictedSavings = futureExpenses.map((e, idx) => ({
    month: `Month ${idx + 1}`,
    expense: e.toFixed(2),
    savings: (income - e).toFixed(2),
  }));

  console.log("\n📊 Predicted Savings for Next 6 Months:");
  predictedSavings.forEach(({ month, expense, savings }) => {
    console.log(`${month}: Expense $${expense}, Savings $${savings}`);
  });
})();
