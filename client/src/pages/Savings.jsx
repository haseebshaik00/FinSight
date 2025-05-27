import { useEffect, useState } from "react";
import * as d3 from "d3";
import PageContainer from "../components/PageContainer";
import SavingsAreaChart from "../components/viz/SavingsAreaChart";
import StackedForecastChart from "../components/viz/StackedForecastChart";

export default function Savings() {
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [forecastedSavings, setForecastedSavings] = useState(0);
  const [monthlySavingsData, setMonthlySavingsData] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const net = income - totalExpenses;
    setNetSavings(net);
    setForecastedSavings(net * 6);
  }, [income, totalExpenses]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5051/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setIncome(data.income);
      else throw new Error(data.message);
    } catch (err) {
      alert("Failed to load user data: " + err.message);
    }
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5051/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
        const total = data.reduce((sum, txn) => sum + Number(txn.amount), 0);
        setTotalExpenses(total);
      } else throw new Error(data.message);
    } catch (err) {
      alert("Failed to load transactions: " + err.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!transactions.length || !income) return;

    const grouped = d3.rollup(
      transactions,
      (v) => d3.sum(v, (d) => +d.amount),
      (d) => d3.timeFormat("%Y-%m")(new Date(d.date))
    );

    const savingsData = Array.from(grouped.entries()).map(
      ([month, totalSpent]) => ({
        month,
        actual: income - totalSpent,
      })
    );

    savingsData.sort((a, b) => new Date(a.month) - new Date(b.month));
    setMonthlySavingsData(savingsData);
  }, [transactions, income]);

  useEffect(() => {
    fetch("http://localhost:5051/api/forecast")
      .then((res) => res.json())
      .then((data) => setForecastData(data))
      .catch((err) => console.error("Forecast fetch error:", err));
  }, []);

  const generateSuggestions = () => {
    if (!forecastData.length) return null;
    const messages = [];
    for (let i = 0; i < forecastData.length; i += 2) {
      const { month, predicted_savings } = forecastData[i];
      const pct = ((predicted_savings / income) * 100).toFixed(0);
      let message = `In ${month}, your savings rate is ${pct}%.`;
      if (pct >= 90) message += " You're doing great! 💰";
      else if (pct >= 70) message += " Keep it up, but there's room to optimize.";
      else if (pct >= 50) message += " Consider reviewing recurring expenses.";
      else message += " Try cutting discretionary spending to boost savings.";
      messages.push(message);
    }
    return messages;
  };

  const totalForecastedSavings = forecastData.reduce(
    (sum, d) => sum + (d.predicted_savings || 0),
    0
  );

  return (
    <PageContainer>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium">Income</h4>
          <p className="text-xl font-bold">${income}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium">Expenses</h4>
          <p className="text-xl font-bold">${totalExpenses}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium">Net Savings</h4>
          <p className="text-xl font-bold">${netSavings}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium">Forecasted Savings (6 months)</h4>
          <p className="text-xl font-bold">
            ${totalForecastedSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts and Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Area Chart */}
        <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Monthly Savings Over Time
          </h4>
          {income > 0 && netSavings !== income ? (
            <SavingsAreaChart data={monthlySavingsData} />
          ) : (
            <p className="text-gray-400 text-sm italic">No savings data available.</p>
          )}
        </div>

        {/* Smart Suggestions */}
        <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Smart Suggestions
          </h4>
          {forecastData.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              {generateSuggestions().map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">Analyzing future savings tips...</p>
          )}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white p-4 rounded-lg shadow mt-4 min-h-[300px]">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Forecasted Expense Composition
        </h4>
        {forecastData.length > 0 ? (
          <StackedForecastChart data={forecastData} income={income} />
        ) : (
          <p className="text-gray-400 italic">Loading forecasted breakdown...</p>
        )}
      </div>
    </PageContainer>
  );
}
