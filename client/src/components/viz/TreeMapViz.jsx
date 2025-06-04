import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function TreeMapViz({ data }) {
  const ref = useRef();

  useEffect(() => {
    const container = ref.current;
    const width = container.offsetWidth;
    const height = 320;

    container.innerHTML = "";

    // Build hierarchical data
    const flatData = Object.entries(data).map(([cls, val]) => ({
      name: cls,
      value: val.allocation,
      children: Object.entries(val.top_assets).map(([name, amt]) => ({
        name,
        value: amt,
        class: cls,
        percent: ((amt / val.allocation) * 100).toFixed(1),
      })),
    }));

    const root = d3.hierarchy({ children: flatData }).sum((d) => d.value);

    const treemapLayout = d3
      .treemap()
      .size([width, height])
      .paddingInner(0)
      .round(true);

    treemapLayout(root);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(d3.schemeTableau10);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("text-align", "left")
      .style("padding", "6px 8px")
      .style("font-size", "12px")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const nodes = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color(d.data.class))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.85);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.name}</strong><br/>` +
            `$${d.data.value.toFixed(2)} (${d.data.percent}%)`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .text((d) => {
        const width = d.x1 - d.x0;
        const name = d.data.name;
        return name.length * 6 < width ? name : name.slice(0, Math.floor(width / 6)) + '…';
      });
  }, [data]);

  return <div ref={ref} className="w-full" />;
}
