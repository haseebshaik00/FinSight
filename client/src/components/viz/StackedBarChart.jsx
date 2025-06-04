import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function StackedBarChart({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!data.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = svgRef.current.parentElement.offsetWidth;
        const height = 300;
        const margin = { top: 40, right: 20, bottom: 50, left: 60 };

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        const cleaned = data.map(d => ({
            month: d.month,
            savings: +d.savings || 0,
            expenses: +d.expenses || 0,
        }));

        const keys = ["savings", "expenses"];
        const stacked = d3.stack().keys(keys)(cleaned);

        const x = d3.scaleBand()
            .domain(cleaned.map(d => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(cleaned, d => d.savings + d.expenses)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#3B82F6", "#F87171"]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-35)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Tooltip
        const tooltip = d3.select(svgRef.current.parentNode)
            .append("div")
            .style("position", "absolute")
            .style("background", "white")
            .style("padding", "6px 12px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "6px")
            .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("visibility", "hidden");

        // Bars
        svg.selectAll("g.layer")
            .data(stacked)
            .enter()
            .append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", d => x(d.data.month))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => {
                const category = d3.select(event.target.parentNode).datum().key;
                const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
                const value = d.data[category];
                tooltip
                    .html(`<strong>${capitalized}</strong><br/>$${value.toFixed(2)}<br/><em>${d.data.month}</em>`)
                    .style("visibility", "visible");
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("top", `${event.pageY - 40}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));

        // Legend (Top-Right)
        const legend = svg
            .append("g")
            .attr("transform", `translate(${width - 100}, ${margin.top - 50})`);

        const legendItems = ["Savings", "Expenses"];
        legendItems.forEach((label, i) => {
            const legendGroup = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            legendGroup.append("rect")
                .attr("width", 14)
                .attr("height", 14)
                .attr("fill", color(label.toLowerCase()));

            legendGroup.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .attr("fill", "#333")
                .attr("font-size", "12px")
                .text(label);
        });

    }, [data]);

    return <svg ref={svgRef} width="100%" height="300px" />;
}
