import { useState } from "react";
import PageContainer from "../components/PageContainer";
import TreeMap from "../components/viz/TreeMap";
import DonutChart from "../components/viz/DonutChart";
import HorizontalBarChart from "../components/viz/HorizontalBarChart";
import FunnelChart from "../components/viz/FunnelChart";

export default function Asset() {
  const [formData, setFormData] = useState({
    savings: "",
    risk_profile: "Conservative",
  });
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAllocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/asset-allocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          savings: Number(formData.savings),
          risk_profile: formData.risk_profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setAllocation(data);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT PANEL: User Input */}
        <div className="bg-white shadow rounded p-6 h-fit md:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Asset Allocation</h2>
          <form onSubmit={fetchAllocation} className="grid gap-4">
            <input
              type="number"
              name="savings"
              value={formData.savings}
              onChange={handleChange}
              placeholder="Enter savings amount"
              required
              className="border p-2 rounded w-full"
            />
            <select
              name="risk_profile"
              value={formData.risk_profile}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="Conservative">Conservative</option>
              <option value="Balanced">Balanced</option>
              <option value="Aggressive">Aggressive</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Allocating..." : "Get Allocation"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Allocation Output + Visualization */}
        {allocation && (
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Allocation Output */}
            <div className="bg-white shadow p-4 rounded-lg max-h-[250px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Suggested Allocation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(allocation).map(([category, info]) => (
                  <div key={category} className="border rounded p-4">
                    <h4 className="font-bold text-gray-700 mb-2 capitalize">{category}</h4>
                    <p className="text-sm text-gray-600">Total: ${info.allocation}</p>
                    <ul className="mt-2 text-sm list-disc list-inside">
                      {Object.entries(info.top_assets).map(([name, amount]) => (
                        <li key={name}>
                          {name}: ${amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
              <div className="bg-white shadow p-4 rounded-lg min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Treemap</h3>
                <TreeMap data={allocation} />
              </div>
              <div className="bg-white shadow p-4 rounded-lg min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Donut Chart</h3>
                <DonutChart data={allocation} />
              </div>
              <div className="bg-white shadow p-4 rounded-lg min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Horizontal Bar Chart</h3>
                <HorizontalBarChart data={allocation} />
              </div>
               <div className="bg-white shadow p-4 rounded-lg min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Funnel Chart</h3>
                <FunnelChart data={allocation} />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
