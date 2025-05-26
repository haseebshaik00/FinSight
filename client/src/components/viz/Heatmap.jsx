import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Heatmap({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 60, right: 20, bottom: 50, left: 80 };
    const height = 300;

    const parsed = data.map(d => ({
      date: new Date(d.date),
      category: d.category,
      amount: +d.amount,
    }));

    const categories = Array.from(new Set(parsed.map(d => d.category)));

    const matrix = d3.rollups(
      parsed,
      v => d3.sum(v, d => d.amount),
      d => d3.timeWeek(d.date), // group by week start
      d => d.category
    );

    const flat = [];
    matrix.forEach(([week, entries]) => {
      entries.forEach(([cat, val]) => {
        flat.push({
          week: week,
          weekStr: d3.timeFormat("%Y-%m-%d")(week),
          category: cat,
          amount: val
        });
      });
    });

    const weeks = [...new Set(flat.map(d => d.weekStr))];
    const cellWidth = 30;
    const width = margin.left + margin.right + cellWidth * weeks.length;

    const x = d3.scaleBand()
      .domain(weeks)
      .range([margin.left, width - margin.right])
      .padding(0.05);

    const y = d3.scaleBand()
      .domain(categories)
      .range([margin.top, height - margin.bottom])
      .padding(0.05);

    const color = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, d3.max(flat, d => d.amount)]);

    svg.attr("width", width).attr("height", height);

    // Title
    svg.append("text")
      .attr("x", margin.left + 20)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "start")
      .style("font-size", "18px")
      .style("font-weight", "700")
      .style("fill", "#1e3a8a")
      .text("Weekly Spending Heatmap (scrollable)");

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

    svg.selectAll("rect")
      .data(flat)
      .join("rect")
      .attr("x", d => x(d.weekStr))
      .attr("y", d => y(d.category))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.amount))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d.category}</strong><br/>Week of ${d3.timeFormat("%B %d")(d.week)}<br/>$${d.amount.toFixed(2)}`
        )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .tickValues(x.domain().filter((d, i) => i % 2 === 0))
        .tickFormat(d => d3.timeFormat("%b %d")(new Date(d))))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    return () => tooltip.remove();
  }, [data]);

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <svg ref={svgRef} height={300} />
    </div>
  );
}
