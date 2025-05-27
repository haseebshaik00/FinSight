import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function StackedForecastChart({ data, income }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length || !income) return;

    const width = 700;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const months = data.map((d) => d.month);
    const expenses = data.map((d) => income - d.predicted_savings);
    const savings = data.map((d) => d.predicted_savings);

    const stackedData = months.map((month, i) => ({
      month,
      Expense: expenses[i],
      Savings: savings[i],
    }));

    const keys = ["Expense", "Savings"];

    const x = d3.scalePoint()
      .domain(months)
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d.Expense + d.Savings)])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#eb5c57", "#2c3e50"]);

    const area = d3.area()
      .x(d => x(d.data.month))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveBasis);

    const stackedSeries = d3.stack().keys(keys)(stackedData);

    g.selectAll("path")
      .data(stackedSeries)
      .join("path")
      .attr("fill", d => color(d.key))
      .attr("d", area)
      .attr("opacity", 0.8);

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height + margin.top + 30})`);

    const legendItems = [
      { label: "Expenses", color: "#eb5c57" },
      { label: "Savings", color: "#2c3e50" }
    ];

    legend.selectAll("rect")
      .data(legendItems)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * 140)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => d.color);

    legend.selectAll("text")
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", (_, i) => i * 140 + 25)
      .attr("y", 14)
      .text(d => d.label)
      .style("font-size", "13px")
      .attr("fill", "#333");
  }, [data, income]);

  return <svg ref={svgRef} className="w-full h-auto" />;
}