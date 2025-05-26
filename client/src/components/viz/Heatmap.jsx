import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Heatmap({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 30, right: 10, bottom: 30, left: 60 };

    const parsed = data.map(d => ({
      date: new Date(d.date),
      category: d.category,
      amount: +d.amount,
    }));

    const weeks = parsed.map(d => d3.timeWeek(d.date).toISOString());
    const categories = Array.from(new Set(parsed.map(d => d.category)));

    const matrix = d3.rollups(
      parsed,
      v => d3.sum(v, d => d.amount),
      d => d3.timeWeek(d.date).toISOString(),
      d => d.category
    );

    const flat = [];
    matrix.forEach(([week, arr]) => {
      arr.forEach(([cat, val]) => {
        flat.push({ week, category: cat, amount: val });
      });
    });

    const x = d3.scaleBand()
      .domain([...new Set(flat.map(d => d.week))])
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

    svg.selectAll("rect")
      .data(flat)
      .join("rect")
      .attr("x", d => x(d.week))
      .attr("y", d => y(d.category))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.amount));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => d.slice(5, 10)));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={svgRef} />;
}
