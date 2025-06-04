// components/TextSummaryBox.jsx
export default function TextSummaryBox({ data }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-800 space-y-4">
        <h2 className="text-xl font-bold">📊 Investment Breakdown</h2>
        {Object.entries(data).map(([cls, val]) => (
          <div key={cls}>
            <p className="font-semibold text-indigo-600">
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
    );
  }
  