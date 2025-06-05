import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TreeMapViz({ data }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 1000;
    const height = 250;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("opacity", 0);

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
      .attr("stroke", "#fff")
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event, svg.node()); // ← Correct relative coords
        d3.select(this).attr("opacity", 0.85);
        tooltip
          .style("opacity", 1)
          .style("left", `${x + 10}px`)
          .style("top", `${y - 20}px`)
          .html(
            `<strong>${d.data.name}</strong><br/>$${d.data.value.toFixed(2)}`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text(d => d.data.name)
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .style("pointer-events", "none");
  }, [data]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-[300px]" />
      <div
        ref={tooltipRef}
        className="absolute bg-black text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-200"
        style={{ position: "absolute", opacity: 0 }}
      ></div>
    </div>
  );
}