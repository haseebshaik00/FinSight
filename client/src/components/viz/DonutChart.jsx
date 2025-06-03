import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function DonutChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const pieData = Object.entries(data).map(([key, val]) => ({
      name: key,
      value: val.allocation,
    }));

    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const pie = d3.pie().value(d => d.value)(pieData);
    const arc = d3.arc().innerRadius(70).outerRadius(radius);

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    chart
      .selectAll("path")
      .data(pie)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#fff");

    chart
      .selectAll("text")
      .data(pie)
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d.data.name);
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
