import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";



(async ()=>{
    const width = window.innerWidth < 768? window.innerWidth * .8 : window.innerWidth * .6;
    const height = window.innerWidth < 768? window.innerHeight * .6 : window.innerHeight * .8;

   const createChart = ()=>{
    return d3.select('body').append('svg')
    .attr('width',width)
    .attr('height',height)
    .attr('style','max-width: 100%; background-Color: #CCC; border-radius: 5px')
   }
   const svg = createChart();
 
   const URL = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
   const {nodes,links} = await d3.json(URL);

   const simulation = d3.forceSimulation(nodes)
   .force("link", d3.forceLink(links).id(d => d.index))
   .force("charge", d3.forceManyBody().strength(-20))
   .force("center", d3.forceCenter(width / 2, height / 2))
   .force("x", d3.forceX(width / 2).strength(0.02)) 
   .force("y", d3.forceY(height / 2).strength(0.04))
   .force("collide", d3.forceCollide(25))

   simulation.alphaDecay(0.05);
   
   const linksElements = svg.selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);
  
    const nodesElements = svg.selectAll("image")
    .data(nodes)
    .enter().append("image")
    .attr("xlink:href", d => `https://flagcdn.com/w40/${d.code.toLowerCase()}.png`)
    .attr("width", 20)
    .attr("height", 15);
 
    simulation.on("tick", () => {
        linksElements.attr("x1", d => d.source.x)
                     .attr("y1", d => d.source.y)
                     .attr("x2", d => d.target.x)
                     .attr("y2", d => d.target.y);
    
        nodesElements.attr("x", d => d.x - 10)
                     .attr("y", d => d.y - 7.5);
    });
  

    nodesElements.on("mouseover", (event, d) => { 
    linksElements.attr("stroke", link => link.source === d || link.target === d ? "whitesmoke" : "#aaa");


    const neighbors = links.filter(link => link.source === d || link.target === d)
                        .map(link => link.source === d ? link.target : link.source);


    nodesElements.filter(node => node === d || neighbors.includes(node))
                .attr("width", 30).attr("height", 20);


    let tooltipContent = `
        <div style="text-align:center; font-weight:bold; padding-bottom: 10px">
            <img src="https://flagcdn.com/w40/${d.code.toLowerCase()}.png" width="40" height="30">
            <p>${d.country}</p>
        </div>
        <hr>
    `;

    neighbors.forEach(neighbor => {
        tooltipContent += `
            <div style="display: flex; align-items: center; margin-top: 10px">
                <img src="https://flagcdn.com/w40/${neighbor.code.toLowerCase()}.png" width="30" height="20">
                <p style="margin-left: 10px;">${neighbor.country}</p>
            </div>
        `;
    });


    d3.select("#tooltip")
        .html(tooltipContent)
        .style("display", "block")
        .style("left", `0`)
        .style("top", `0`);
});



    nodesElements.on("mouseout", (event, d) => {
        linksElements.attr("stroke", "#aaa"); 
        nodesElements.attr("width", 20).attr("height", 15);
        d3.select("#tooltip").style("display", "none"); 
    });
    
})();



