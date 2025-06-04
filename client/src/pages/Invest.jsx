import PageContainer from "../components/PageContainer";
import { useState } from "react";
import TreeMapViz from "../components/viz/TreeMapViz";
import DonutChart from "../components/viz/DonutChart";

export default function Invest() {
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState("Balanced");
  const [allocationData, setAllocationData] = useState(null);

  const handleSubmit = () => {
    fetch("http://localhost:8000/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), risk_profile: risk }),
    })
      .then(res => res.json())
      .then((data) => {
        setAllocationData(data.allocations);
        console.log(allocationData);
      })
      .catch(err => console.error("Error:", err));
  };

  return (
    <PageContainer>
      <div className="p-4 mx-auto bg-white rounded-lg shadow-md mb-2">
        <h2 className="text-2xl font-bold mb-1">Investment Plan Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-end">
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
      </div>

      {allocationData && (
        // <div className="space-y-6 mt-2">

        //   {/* Treemap - Full Width Row */}
        //   <div className="bg-white shadow-md rounded-lg p-4">
        //     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        //       Asset Allocation TreeMap
        //     </h2>
        //     <TreeMapViz data={allocationData || {}} />
        //   </div>

        //   {/* Donut + Summary - Two Column Row */}
        //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        //     {/* Donut Chart */}
        //     <div className="bg-white shadow-md rounded-lg p-4">
        //       <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        //         Asset Class Distribution
        //       </h2>
        //       <DonutChart data={allocationData || {}} />
        //     </div>

        //     {/* Summary Box */}
        //     <div className="bg-white shadow-md rounded-lg p-6 text-gray-800">
        //       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Investment Breakdown</h2>
        //       {Object.entries(allocationData).map(([cls, val]) => (
        //         <div key={cls} className="mb-4">
        //           <p className="font-semibold text-indigo-600 mb-1">
        //             {cls.toUpperCase()}: ${val.allocation}
        //           </p>
        //           <ul className="text-sm text-gray-600 pl-4 list-disc">
        //             {Object.entries(val.top_assets).map(([asset, amount]) => (
        //               <li key={asset}>
        //                 <em>{asset}</em>: ${amount.toFixed(2)} ({((amount / val.allocation) * 100).toFixed(1)}%)
        //               </li>
        //             ))}
        //           </ul>
        //         </div>
        //       ))}
        //     </div>

        //   </div>

        // </div>

        <>
          {/* Main Line Chart */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Asset Allocation TreeMap</h2>
            <TreeMapViz data={allocationData || {}} />
          </div>

          {/* Stacked Bar + Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">Asset Class Distribution</h2>
              <DonutChart data={allocationData || {}} />
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-gray-800">
              <h2 className="text-2xl font-bold mb-8">Investment Breakdown</h2>
              {Object.entries(allocationData).map(([cls, val]) => (
                <div key={cls} className="mb-4">
                  <p className="font-semibold text-indigo-600 mb-1">
                    {cls.toUpperCase()}: ${val.allocation}
                  </p>
                  <ul className="text-sm text-gray-600 pl-4 list-disc">
                    {Object.entries(val.top_assets).map(([asset, amount]) => (
                      <li key={asset}>
                        <em>{asset}</em>: ${amount.toFixed(2)} ({((amount / val.allocation) * 100).toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </PageContainer>
  );
}
