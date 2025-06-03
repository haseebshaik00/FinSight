import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TreeMap({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 600;
    const height = 300;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Convert allocation data to hierarchical format
    const hierarchyData = {
      name: "Allocation",
      children: Object.entries(data).map(([category, info]) => ({
        name: category,
        children: Object.entries(info.top_assets).map(([asset, amount]) => ({
          name: asset,
          value: amount,
        })),
      })),
    };

    const root = d3.hierarchy(hierarchyData).sum(d => d.value);
    d3.treemap().size([width, height]).padding(2)(root);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const nodes = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.parent.data.name))
      .attr("stroke", "#fff");

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text(d => d.data.name)
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .style("pointer-events", "none");
  }, [data]);

  return <svg ref={svgRef} className="w-full h-[300px]" />;
}
