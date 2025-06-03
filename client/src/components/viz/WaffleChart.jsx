import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function WaffleChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 300;
    const height = 600;
    const cellSize = 18;
    const columns = Math.floor(width / cellSize);

    const flatData = Object.entries(data).flatMap(([category, info]) =>
      Object.entries(info.top_assets).map(([name, amount]) => ({
        name,
        value: amount,
        category,
      }))
    );

    const total = d3.sum(flatData, (d) => d.value);

    const percentageData = flatData.flatMap((d) =>
      Array(Math.round((d.value / total) * 100)).fill(d)
    );

    const colorScale = d3
      .scaleOrdinal()
      .domain(flatData.map((d) => d.name))
      .range(d3.schemeTableau10);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width + 300)
      .attr("height", height + 200)
      .append("g")
      .selectAll("rect")
      .data(percentageData)
      .join("rect")
      .attr("x", (_, i) => (i % columns) * cellSize)
      .attr("y", (_, i) => Math.floor(i / columns) * cellSize)
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("fill", (d) => colorScale(d.name));

    const legend = svg
      .append("g")
      .attr("transform", `translate(0, ${height + 20})`);

    const grouped = d3.groups(flatData, (d) => d.category);

    let xOffset = 0;
    grouped.forEach(([category, items]) => {
      legend
        .append("text")
        .attr("x", xOffset)
        .attr("y", 0)
        .text(category)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#000");

      const uniqueItems = Array.from(new Set(items.map((d) => d.name)));

      legend
        .selectAll(`rect-${category}`)
        .data(uniqueItems)
        .join("rect")
        .attr("x", xOffset)
        .attr("y", (d, i) => 20 + i * 22)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", (d) => colorScale(d));

      legend
        .selectAll(`text-${category}`)
        .data(uniqueItems)
        .join("text")
        .attr("x", xOffset + 24)
        .attr("y", (d, i) => 20 + i * 22 + 14)
        .text((d) => d)
        .attr("font-size", "12px")
        .attr("fill", "#333");

      xOffset += 160;
    });
  }, [data]);

  return <svg ref={svgRef} className="w-full h-auto" />;
}
