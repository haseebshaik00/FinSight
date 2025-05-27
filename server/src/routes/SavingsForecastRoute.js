const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const income = 3000;

async function forecastSavings() {
  const raw = fs.readFileSync('mock_expenses.json');
  const transactions = JSON.parse(raw);

  const grouped = {};
  transactions.forEach(({ date, amount }) => {
    const month = date.slice(0, 7);
    grouped[month] = (grouped[month] || 0) + amount;
  });
  if (monthlyRecords.length < 3) {
     return res.json([]); // or res.status(204).send()
   }

  const sortedMonths = Object.keys(grouped).sort();
  const expenses = sortedMonths.map(month => grouped[month]);

  const xs = tf.tensor1d(expenses.slice(0, -1));
  const ys = tf.tensor1d(expenses.slice(1));

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  await model.fit(xs.reshape([-1, 1]), ys.reshape([-1, 1]), { epochs: 200, verbose: 0 });

  let last = expenses[expenses.length - 1];
  const predictions = [];

  for (let i = 0; i < 6; i++) {
    const input = tf.tensor2d([[last]]);
    const prediction = model.predict(input);
    const exp = prediction.dataSync()[0];
    predictions.push({
      month: `Month ${i + 1}`,
      predicted_expense: exp,
      predicted_savings: income - exp,
    });
    last = exp;
  }

  return predictions;
}

router.get('/', async (req, res) => {
  try {
    const forecast = await forecastSavings();
    res.json(forecast);
  } catch (err) {
    console.error("Forecast error:", err.message);
    res.status(500).json({ error: "Forecast failed" });
  }
});

module.exports = router;
