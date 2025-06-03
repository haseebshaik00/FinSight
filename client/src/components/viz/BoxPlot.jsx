import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BoxPlot({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 300;
    const height = 300;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const values = Object.values(data).flatMap(cat =>
      Object.values(cat.top_assets).map(val => Number(val))
    );

    const x = d3.scaleBand()
      .domain(["Assets"])
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(values)])
      .nice()
      .range([height - 20, 20]);

    const box = {
      min: d3.min(values),
      q1: d3.quantile(values, 0.25),
      median: d3.median(values),
      q3: d3.quantile(values, 0.75),
      max: d3.max(values)
    };

    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 4},0)`);

    const g = svg.append("g");

    // Vertical line
    g.append("line")
      .attr("x1", width / 2)
      .attr("x2", width / 2)
      .attr("y1", y(box.min))
      .attr("y2", y(box.max))
      .attr("stroke", "#555");

    // Box
    g.append("rect")
      .attr("x", width / 2 - 40)
      .attr("y", y(box.q3))
      .attr("width", 80)
      .attr("height", y(box.q1) - y(box.q3))
      .attr("fill", "#a5b4fc");

    // Median line
    g.append("line")
      .attr("x1", width / 2 - 40)
      .attr("x2", width / 2 + 40)
      .attr("y1", y(box.median))
      .attr("y2", y(box.median))
      .attr("stroke", "black");

    // Min & Max ticks
    g.append("line")
      .attr("x1", width / 2 - 20)
      .attr("x2", width / 2 + 20)
      .attr("y1", y(box.min))
      .attr("y2", y(box.min))
      .attr("stroke", "#777");

    g.append("line")
      .attr("x1", width / 2 - 20)
      .attr("x2", width / 2 + 20)
      .attr("y1", y(box.max))
      .attr("y2", y(box.max))
      .attr("stroke", "#777");

  }, [data]);

  return <svg ref={svgRef}></svg>;
}
