import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function FunnelChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 300;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 30 };

    const flatData = Object.entries(data).map(([category, info]) => ({
      category,
      value: info.allocation,
    }));

    const total = d3.sum(flatData, (d) => d.value);
    const funnelLevels = flatData.map((d) => ({
      ...d,
      percent: d.value / total,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const funnel = svg.append("g").attr("transform", `translate(${width / 2}, ${margin.top})`);

    const sectionHeight = (height - margin.top - margin.bottom) / funnelLevels.length;

    const color = d3.scaleOrdinal().domain(funnelLevels.map(d => d.category)).range(d3.schemeSet2);

    funnelLevels.reduce((acc, curr, i) => {
      const topWidth = acc;
      const bottomWidth = topWidth * 0.8;

      const points = [
        [-topWidth / 2, i * sectionHeight],
        [topWidth / 2, i * sectionHeight],
        [bottomWidth / 2, (i + 1) * sectionHeight],
        [-bottomWidth / 2, (i + 1) * sectionHeight],
      ];

      funnel
        .append("path")
        .attr("d", d3.line()(points.concat([points[0]])))
        .attr("fill", color(curr.category))
        .attr("stroke", "#fff");

      funnel
        .append("text")
        .attr("x", 0)
        .attr("y", i * sectionHeight + sectionHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(`${curr.category}: $${curr.value}`)
        .attr("fill", "#000")
        .attr("font-size", "14px");

      return bottomWidth;
    }, width * 0.9);
  }, [data]);

  return <svg ref={svgRef} className="w-full h-auto" />;
}
