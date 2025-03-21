// Site map visualization using D3.js
document.addEventListener('DOMContentLoaded', () => {
    const graphContainer = document.getElementById('graph-container');
    if (!graphContainer) return;

    // Define the nodes and links for the site map
    const nodes = [
        { id: 'home', label: 'Home' },
        { id: 'projects', label: 'Projects' },
        { id: 'about', label: 'About' },
        { id: 'contact', label: 'Contact' }
    ];

    const links = [
        { source: 'home', target: 'projects' },
        { source: 'home', target: 'about' },
        { source: 'home', target: 'contact' },
        { source: 'projects', target: 'about' },
        { source: 'projects', target: 'contact' },
        { source: 'about', target: 'contact' }
    ];

    let svg, simulation;
    let width, height;

    // Function to update dimensions
    function updateDimensions() {
        width = graphContainer.clientWidth;
        height = graphContainer.clientHeight;
        
        // Update SVG dimensions
        svg.attr('width', width)
           .attr('height', height);
        
        // Update simulation center
        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        
        // Restart simulation to apply new dimensions
        simulation.alpha(0.3).restart();
    }

    // Set up the SVG container
    svg = d3.select(graphContainer)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [0, 0, width, height]);

    // Create the simulation
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        // Add random motion force
        .force('random', () => {
            nodes.forEach(node => {
                node.vx += (Math.random() - 0.5) * 0.1;
                node.vy += (Math.random() - 0.5) * 0.1;
            });
        });

    // Create the links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 1);

    // Create the nodes
    const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        // Add click handler for navigation
        .on('click', (event, d) => {
            const pageMap = {
                'home': 'index.html',
                'projects': 'projects.html',
                'about': 'about.html',
                'contact': 'contact.html'
            };
            
            const targetPage = pageMap[d.id];
            if (targetPage) {
                window.location.href = targetPage;
            }
        });

    // Add circles to nodes
    node.append('circle')
        .attr('r', 5)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.2)
        .style('cursor', 'pointer'); // Add pointer cursor to indicate clickability

    // Add labels below nodes
    node.append('text')
        .attr('dy', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.8rem')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(d => d.label);

    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    // Hover effects
    node.on('mouseover', function(event, d) {
        // Stop the simulation
        simulation.alphaTarget(0);
        
        // Highlight connected links
        link
            .attr('stroke-opacity', l => 
                (l.source === d || l.target === d) ? 0.5 : 0.1
            );

        // Highlight the node
        d3.select(this)
            .select('circle')
            .attr('r', 7)
            .attr('opacity', 0.4);

        d3.select(this)
            .select('text')
            .attr('opacity', 1);
    })
    .on('mouseout', function(event, d) {
        // Restart the simulation
        simulation.alphaTarget(0.3).restart();
        
        // Reset link opacity
        link.attr('stroke-opacity', 0.1);

        // Reset node appearance
        d3.select(this)
            .select('circle')
            .attr('r', 5)
            .attr('opacity', 0.2);

        d3.select(this)
            .select('text')
            .attr('opacity', 0.7);
    });

    // Handle window resize
    window.addEventListener('resize', updateDimensions);
    
    // Initial dimensions setup
    updateDimensions();
}); 