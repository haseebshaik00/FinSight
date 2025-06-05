// components/viz/DonutChart.jsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function DonutChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 300;
    const height = 280;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(d3.schemeCategory10);

    const total = d3.sum(Object.values(data), d => d.allocation);

    const svgEl = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
      .value(d => d[1].allocation)
      .sort(null);

    const data_ready = pie(Object.entries(data));
    const arc = d3.arc().innerRadius(80).outerRadius(radius);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "8px 12px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("border-radius", "6px")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const slices = svgEl.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 0 2px rgba(0,0,0,0.15))")
      .style("transition", "all 0.2s ease-in-out")
      .on("mouseover", function (event, d) {
        const percent = ((d.data[1].allocation / total) * 100).toFixed(1);
        tooltip
          .html(`<strong>${capitalize(d.data[0])}</strong><br/>$${d.data[1].allocation}<br/>${percent}%`)
          .style("opacity", 1);

        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0 0 8px rgba(255,255,255,0.6))");

        svgEl.select(`#label-${d.data[0]}`)
          .style("fill", "#fff")
          .style("font-weight", "700")
          .style("font-size", "15px");
      })
      .on("mousemove", event => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        tooltip.style("opacity", 0);

        d3.select(this)
          .attr("stroke", "none")
          .style("filter", "drop-shadow(0 0 2px rgba(0,0,0,0.15))");

        svgEl.select(`#label-${d.data[0]}`)
          .style("fill", "#fff")
          .style("font-weight", "600")
          .style("font-size", "14px");
      });

    svgEl.selectAll("text")
      .data(data_ready)
      .join("text")
      .attr("id", d => `label-${d.data[0]}`)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => capitalize(d.data[0]))
      .style("fill", "#fff")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("pointer-events", "none");

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return () => tooltip.remove();
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} className="w-full h-auto" />
      <p className="text-sm text-gray-600 mt-3 text-center max-w-xs">
        This chart shows your overall investment distribution across asset classes.
        Hover over each slice to view the exact amount and percentage allocated to that category.
      </p>
    </div>
  );
}
