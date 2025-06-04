// components/viz/TreeMapViz.jsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function TreeMapViz({ data }) {
  const ref = useRef();

  useEffect(() => {
    const width = ref.current.offsetWidth;
    const height = 400;

    const flatData = Object.entries(data).map(([cls, val]) => ({
      name: cls,
      value: val.allocation,
      children: Object.entries(val.top_assets).map(([name, amt]) => ({
        name,
        value: amt,
      })),
    }));

    const root = d3
      .hierarchy({ name: "root", children: flatData })
      .sum((d) => d.value);

    const treemapLayout = d3.treemap().size([width, height]).padding(2);
    treemapLayout(root);

    const svg = d3.select(ref.current).html("").append("svg").attr("width", width).attr("height", height);

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
      .attr("fill", "#4f46e5");

    nodes
      .append("title")
      .text((d) => `${d.ancestors()[1].data.name} > ${d.data.name}: $${d.data.value.toFixed(2)}`);

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text((d) => d.data.name);
  }, [data]);

  return <div ref={ref} />;
}
