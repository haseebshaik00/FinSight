import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function LineChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

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
      .y(d => y(d.amount));

    svg.append("path")
      .datum(aggregated)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={svgRef} width={400} height={300} />;
}
