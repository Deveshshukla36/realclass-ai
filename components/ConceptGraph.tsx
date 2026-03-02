
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Concept } from '../types';

interface ConceptGraphProps {
  concepts: Concept[];
}

const ConceptGraph: React.FC<ConceptGraphProps> = ({ concepts }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || concepts.length === 0) return;

    const width = svgRef.current.clientWidth || 800;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = concepts.map(c => ({ id: c.id, name: c.name, mastery: c.mastery }));
    const links: any[] = [];
    concepts.forEach(c => {
      c.dependencies.forEach(depId => {
        links.push({ source: depId, target: c.id });
      });
    });

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", (d: any) => 15 + (d.mastery * 10))
      .attr("fill", (d: any) => d3.interpolateRdYlGn(d.mastery))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("class", "fill-slate-600 font-medium");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [concepts]);

  return (
    <div className="w-full h-[400px] bg-white rounded-xl border border-slate-200 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-semibold text-slate-800">Dynamic Knowledge Graph</h3>
        <p className="text-xs text-slate-500">Interactive concept dependencies & mastery</p>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default ConceptGraph;
