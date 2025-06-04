// components/viz/DonutChart.jsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function DonutChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svgEl = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d[1].allocation);
    const data_ready = pie(Object.entries(data));

    const arc = d3.arc().innerRadius(80).outerRadius(radius);

    svgEl
      .selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => d3.schemeCategory10[i])
      .append("title")
      .text((d) => `${d.data[0]}: $${d.data[1].allocation}`);

    svgEl
      .selectAll("text")
      .data(data_ready)
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data[0]);
  }, [data]);

  return <svg ref={ref} className="w-full h-auto" />;
}
