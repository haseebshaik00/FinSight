import { useEffect, useState } from "react";
import * as d3 from "d3";
import PageContainer from "../components/PageContainer";
import ForecastLineChart from "../components/viz/ForecastLineChart";
import StackedBarChart from "../components/viz/StackedBarChart";

export default function Savings() {
    const [combinedData, setCombinedData] = useState([]);
    const [last6MonthComparison, setLast6MonthComparison] = useState([]);
    const [metrics, setMetrics] = useState({ income: 0, expenses: 0, net: 0, forecast: 0 });
    const [summary, setSummary] = useState("");
    const [advice, setAdvice] = useState("");

    useEffect(() => {
        fetch("http://localhost:5051/api/savings/forecast", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                const parseDate = d3.timeParse("%Y-%m");

                const past = Object.entries(data.past_savings_by_each_month)
                    .map(([month, value]) => {
                        const date = parseDate(month);
                        return date ? { month, dateObj: date, past: value } : null;
                    })
                    .filter(Boolean);

                const future = Object.entries(data.forecasted_savings_by_each_month)
                    .map(([month, value]) => {
                        const date = parseDate(month);
                        return date ? { month, dateObj: date, forecast: value } : null;
                    })
                    .filter(Boolean);

                const combined = [...past, ...future].sort((a, b) => a.dateObj - b.dateObj);
                setCombinedData(combined);

                const monthlyIncome = data.total_income / Object.keys(data.past_savings_by_each_month).length;

                const recent6 = past.slice(-6).map(d => ({
                    month: d3.timeFormat("%b %Y")(d.dateObj),
                    savings: d.past || 0,
                    expenses: Math.max(0, monthlyIncome - (d.past || 0)),
                }));
                setLast6MonthComparison(recent6);

                setMetrics({
                    income: data.total_income,
                    expenses: data.total_expenses,
                    net: data.net_savings,
                    forecast: d3.sum(data.forecasted_savings || []),
                    categories: data.expense_by_category,
                });

                setSummary(data.summary_prompt);
                setAdvice(data.advice_prompt);
            });
    }, []);

    return (
        <PageContainer title="Savings Overview">
            {/* Top 4 Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Income</p>
                    <p className="text-xl font-bold text-green-800">${metrics.income.toFixed(2)}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="text-xl font-bold text-red-800">${metrics.expenses.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Net Savings</p>
                    <p className="text-xl font-bold text-blue-800">${metrics.net.toFixed(2)}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Forecasted Savings (6 months)</p>
                    <p className="text-xl font-bold text-purple-800">${metrics.forecast.toFixed(2)}</p>
                </div>
            </div>

            {/* Main Line Chart */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Savings and Future Savings Forecast</h2>
                <ForecastLineChart data={combinedData} />
            </div>

            {/* Stacked Bar + Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">Savings vs Expenses (Past 6 months)</h2>
                    <StackedBarChart data={last6MonthComparison} />
                </div>
                <div className="bg-white shadow-md rounded-xl p-6 text-gray-800">
                    <h2 className="text-2xl font-bold mb-8">Insights</h2>
                    <p className="mb-3 leading-relaxed text-gray-700">
                        <span className="font-medium text-gray-800"><b>Trend:</b></span> {summary}
                    </p>
                    <p className="mb-10 italic text-gray-600 border-l-4 border-blue-300 pl-4">
                        {advice}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Quick Tip:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Set monthly budgets for non-essential categories.</li>
                            <li>Use automated transfers to grow savings consistently.</li>
                            <li>Review top 3 spending categories every month.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
