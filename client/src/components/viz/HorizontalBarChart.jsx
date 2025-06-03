import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function HorizontalBarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const flatData = Object.entries(data).flatMap(([category, info]) =>
      Object.entries(info.top_assets).map(([name, amount]) => ({
        name,
        value: amount,
        category,
      }))
    );

    const x = d3.scaleLinear()
      .domain([0, d3.max(flatData, d => d.value)])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(flatData.map(d => d.name))
      .range([0, height])
      .padding(0.1);

    const color = d3.scaleOrdinal()
      .domain(flatData.map(d => d.category))
      .range(d3.schemeTableau10);

    const chart = svg
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chart.selectAll("rect")
      .data(flatData)
      .join("rect")
      .attr("y", d => y(d.name))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.value))
      .attr("fill", d => color(d.category));

    chart.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("font-size", "12px");

    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px");

  }, [data]);

  return <svg ref={svgRef} className="w-full h-auto" style={{ maxHeight: "600px" }} />;
}