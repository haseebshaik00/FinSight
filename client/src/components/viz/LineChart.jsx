import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function LineChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = svgRef.current.parentElement.offsetWidth || 600;
    const width = containerWidth;
    const height = 350;
    const margin = { top: 40, right: 40, bottom: 50, left: 60 };

    const parsedData = data.map(d => ({
      date: new Date(d.date),
      amount: +d.amount,
    }));

    const aggregated = d3.rollups(
      parsedData,
      v => d3.sum(v, d => d.amount),
      d => d3.timeMonth(d.date)
    ).map(([date, amount]) => ({ date, amount }));

    const x = d3.scaleTime()
      .domain(d3.extent(aggregated, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregated, d => d.amount)]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.amount))
      .curve(d3.curveMonotoneX);

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "700")
      .style("fill", "#1e3a8a")
      .text("Monthly Total Spending Over Time");

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%B")))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Line Path
    svg.append("path")
      .datum(aggregated)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

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

    // Circles and interactivity
    svg.selectAll("circle")
      .data(aggregated)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.amount))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
          .html(
            `<strong>${d3.timeFormat("%B %Y")(d.date)}</strong><br/>$${d.amount.toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    return () => tooltip.remove();
  }, [data]);

  return <svg ref={svgRef} width="100%" height={350} />;
}
