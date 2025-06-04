import PageContainer from "../components/PageContainer";
import { useState } from "react";

export default function Invest() {
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState("Balanced");
  const [output, setOutput] = useState([]);

  const handleSubmit = () => {
    fetch("http://localhost:8000/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), risk_profile: risk }),
    })
      .then(res => res.json())
      .then(data => setOutput(data.allocations))
      .catch(err => console.error("Error:", err));
  };

  return (
    <PageContainer>
      <div className="p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Investment Plan Generator</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <div className="flex flex-col w-full">
            <label className="block mb-1"><b>Amount</b></label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$ 00.00 USD"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="block mb-1"><b>Risk Profile</b></label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="Conservative">Conservative</option>
              <option value="Balanced">Balanced</option>
              <option value="Aggressive">Aggressive</option>
            </select>
          </div>

          <div className="flex justify-end w-full">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded w-full"
            >
              Predict
            </button>
          </div>
        </div>

        {output?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Model Output:</h3>
            <ul className="list-disc list-inside">
              {output.map((val, idx) => (
                <li key={idx}>Class {idx + 1}: {val.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageContainer>

  );
}
