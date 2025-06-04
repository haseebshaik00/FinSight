import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function ForecastLineChart({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!data.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = svgRef.current.parentElement.offsetWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.dateObj))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.past || d.forecast)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .defined(d => d.past !== undefined)
            .x(d => x(d.dateObj))
            .y(d => y(d.past));

        const forecastLine = d3.line()
            .defined(d => d.forecast !== undefined)
            .x(d => x(d.dateObj))
            .y(d => y(d.forecast));

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(
                d3.axisBottom(x)
                    .ticks(data.length)
                    .tickFormat(d3.timeFormat("%b %Y"))
            )
            .selectAll("text")
            .attr("transform", "rotate(-35)")
            .style("text-anchor", "end");

        // Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Tooltip
        const tooltip = d3.select(svgRef.current.parentNode)
            .append("div")
            .style("position", "absolute")
            .style("background", "white")
            .style("padding", "8px 12px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "6px")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("visibility", "hidden");

        // Lines
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#3B82F6")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#F59E0B")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4 3")
            .attr("d", forecastLine);

        // Circles for past values
        svg.selectAll(".dot-past")
            .data(data.filter(d => d.past !== undefined))
            .enter()
            .append("circle")
            .attr("cx", d => x(d.dateObj))
            .attr("cy", d => y(d.past))
            .attr("r", 4)
            .attr("fill", "#3B82F6")
            .on("mouseover", (event, d) => {
                tooltip
                    .html(`<strong>${d3.timeFormat("%B %Y")(d.dateObj)}</strong><br/>Past: $${d.past.toFixed(2)}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", event => {
                tooltip
                    .style("top", `${event.pageY - 40}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));

        // Circles for forecast values
        svg.selectAll(".dot-forecast")
            .data(data.filter(d => d.forecast !== undefined))
            .enter()
            .append("circle")
            .attr("cx", d => x(d.dateObj))
            .attr("cy", d => y(d.forecast))
            .attr("r", 4)
            .attr("fill", "#F59E0B")
            .on("mouseover", (event, d) => {
                tooltip
                    .html(`<strong>${d3.timeFormat("%B %Y")(d.dateObj)}</strong><br/>Forecast: $${d.forecast.toFixed(2)}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", event => {
                tooltip
                    .style("top", `${event.pageY - 40}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));
    }, [data]);

    return <svg ref={svgRef} width="100%" height="300px" />;
}
