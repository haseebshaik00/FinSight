const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const protect = require('../middlewares/authMiddleware');
const axios = require('axios');

router.use(protect);

router.get('/forecast', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        const user = await User.findById(req.user.id);
        if (!user || typeof user.income !== 'number') {
            return res.status(400).json({ error: 'User income is missing or invalid' });
        }

        const income = user.income;
        const expensesByMonth = {};
        const categoryTotals = {};

        // Step 1: Group transactions by month
        for (const txn of transactions) {
            const date = new Date(txn.date);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            expensesByMonth[month] = (expensesByMonth[month] || 0) + Math.abs(txn.amount);

            const cat = txn.category || 'Other';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(txn.amount);
        }

        // Step 2: Calculate savings per month = income − expenses
        const sortedMonths = Object.keys(expensesByMonth).sort((a, b) => new Date(a) - new Date(b));
        const pastSavingsDict = {};
        const pastSavingsList = [];

        for (const month of sortedMonths) {
            const expenses = expensesByMonth[month];
            const savings = income - expenses;
            pastSavingsDict[month] = savings;
            pastSavingsList.push(savings);
        }

        // Step 3: Forecast savings
        const forecastResponse = await axios.post('http://localhost:8000/api/savings/forecast', {
            past_savings: pastSavingsList,
            expense_by_category: categoryTotals,
        });

        const forecastedSavings = forecastResponse.data.forecasted_savings || [];
        const forecastedSavingsDict = {};
        const now = new Date();

        for (let i = 1; i <= forecastedSavings.length; i++) {
            const future = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const label = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}`;
            forecastedSavingsDict[label] = forecastedSavings[i - 1];
        }

        const totalExpenses = Object.values(expensesByMonth).reduce((sum, val) => sum + val, 0);
        const totalSavings = Object.values(pastSavingsDict).reduce((sum, val) => sum + val, 0);

        for (const month of sortedMonths) {
            const expenses = expensesByMonth[month];
            const savings = income - expenses;
            pastSavingsDict[month] = savings;
            pastSavingsList.push(savings);
            console.log(`${month} → Expenses: $${expenses.toFixed(2)}, Savings: $${savings.toFixed(2)}`);
        }

        res.json({
            past_savings: pastSavingsList,
            past_savings_by_each_month: pastSavingsDict,
            forecasted_savings: forecastedSavings,
            forecasted_savings_by_each_month: forecastedSavingsDict,
            summary_prompt: forecastResponse.data.summary_prompt,
            advice_prompt: forecastResponse.data.advice_prompt,
            expense_by_category: categoryTotals,
            total_income: income * sortedMonths.length,
            total_expenses: totalExpenses,
            net_savings: totalSavings
        });
    } catch (err) {
        console.error('Route Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
