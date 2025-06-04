import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function PieChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 480;
    const height = 340;
    const radius = Math.min(width, height) / 2 - 20;
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    svg.append("text")
      .attr("x", (width + 320) / 2)
      .attr("y", 330)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "700")
      .style("fill", "#1e3a8a")
      .text("Category-wise Spending");

    const categorySums = d3.rollups(
      data,
      v => d3.sum(v, d => +d.amount),
      d => d.category
    );

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(0).outerRadius(radius + 10);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#f9fafb")
      .style("color", "#111827")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
      .style("opacity", 0)
      .style("pointer-events", "none");

    const g = svg
      .attr("width", width + 160)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${radius + 20}, ${height / 2})`);

    // Animate entry + tooltip interaction
    const arcs = g.selectAll("path")
      .data(pie(categorySums))
      .enter()
      .append("path")
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // Rebind for interactivity
    g.selectAll("path")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arcHover);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`<strong>${d.data[0]}</strong><br/>$${d.data[1].toFixed(2)}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arc);
        tooltip.transition().duration(300).style("opacity", 0);
      });

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 110}, 20)`);

    categorySums.forEach(([category], i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 24})`);

      legendRow.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", color(category));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("text-anchor", "start")
        .style("font-size", "13px")
        .style("fill", "#black")
        .text(category);
    });

    return () => tooltip.remove();
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
