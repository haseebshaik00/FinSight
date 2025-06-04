import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import BarChart from "../components/viz/BarChart";
import PieChart from "../components/viz/PieChart";
import LineChart from "../components/viz/LineChart";
import Heatmap from "../components/viz/Heatmap";

export default function Home() {
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
  });
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5051/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
      else throw new Error(data.message);
    } catch (err) {
      alert("Failed to load transactions: " + err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5051/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add expense");
      alert("Expense added successfully!");
      setFormData({ date: "", category: "", amount: "" });
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageContainer>
      <div className="bg-white shadow-md rounded-xl p-4 mb-4 w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Enter New Expense!</h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Food and Groceries">Food and Groceries</option>
            <option value="Shopping">Shopping</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="EMIs">EMIs</option>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Gas">Gas</option>
            <option value="Self Care">Self Care</option>
            <option value="Medical Bills">Medical Bills</option>
          </select>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="$ 00.00 USD"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Add Expense
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full bg-white rounded-xl p-4 shadow-md">
          <PieChart data={transactions} />
        </div>
        <div className="w-full bg-white rounded-xl p-4 shadow-md">
          <BarChart data={transactions} />
        </div>
        <div className="w-full bg-white rounded-xl p-4 shadow-md">
          <LineChart data={transactions} />
        </div>
        <div className="w-full bg-white rounded-xl p-4 shadow-md">
          <Heatmap data={transactions} />
        </div>
      </div>
    </PageContainer>
  );
}
