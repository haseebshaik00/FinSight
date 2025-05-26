import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function BarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const categorySums = d3.rollups(
      data,
      v => d3.sum(v, d => +d.amount),
      d => d.category
    );

    const x = d3.scaleBand()
      .domain(categorySums.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(categorySums, d => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .selectAll("rect")
      .data(categorySums)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(0) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", "#3b82f6");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={svgRef} width={400} height={300} />;
}
