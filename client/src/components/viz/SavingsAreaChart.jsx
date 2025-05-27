// SavingsAreaChart.jsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const SavingsAreaChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600;
    const height = 300;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.actual)])
      .nice()
      .range([height, 0]);

    const area = d3
      .area()
      .x((d) => x(d.month) + x.bandwidth() / 2)
      .y0(height)
      .y1((d) => y(d.actual))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "#bee3f8")
      .attr("stroke", "#3182ce")
      .attr("stroke-width", 2)
      .attr("d", area);

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.actual))
      .attr("r", 4)
      .attr("fill", "#2b6cb0");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",")))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end")
      .style("font-size", "12px");
  }, [data]);

  return <svg ref={svgRef} className="w-full h-auto" />;
};

export default SavingsAreaChart;
