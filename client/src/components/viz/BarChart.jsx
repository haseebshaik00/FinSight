import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function BarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = svgRef.current.parentElement.offsetWidth || 700;
    const width = containerWidth;
    const height = 350;
    const margin = { top: 50, right: 30, bottom: 80, left: 60 };

    const categorySums = d3.rollups(
      data,
      v => d3.sum(v, d => +d.amount),
      d => d.category
    );

    const x = d3.scaleBand()
      .domain(categorySums.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(categorySums, d => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("fill", "#1e3a8a")
      .text("Total Spending by Category");

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
      .style("pointer-events", "none")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("opacity", 0);

    // Bars
    svg.append("g")
      .selectAll("rect")
      .data(categorySums)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(0) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", "#3b82f6")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
          .html(`<strong>${d[0]}</strong><br/>$${d[1].toFixed(2)}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.25em")
      .attr("transform", "rotate(-30)");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    return () => tooltip.remove(); // Cleanup
  }, [data]);

  return <svg ref={svgRef} width="100%" height={350} />;
}
