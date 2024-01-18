async function fetchData(filePath) {
  const response = await fetch(filePath);
  const csvData = await response.text();
  return d3.csvParse(csvData, d3.autoType);
}


async function run() {
  // Chargement des données
  const dataAsthme = await fetchData("data/Asthme_file.csv");
  const dataDiabete = await fetchData("data/diabete_file.csv");
  const dataTension = await fetchData("data/Tension(HTA)_file.csv");

  // Set up dimensions and margins
  const margin = { top: 40, right: 60, bottom: 70, left: 40 };
  const width = 1450 - margin.left - margin.right;
  const height = 650 - margin.top - margin.bottom;

  const svg1 = d3
      .select("#svg1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define color scale
  const color = d3.scaleOrdinal()
      .domain(['Femme(Sport)', 'Femme(NonSport)', 'Homme(Sport)', 'Homme(NonSport)'])
      .range([' hsla(313, 100%, 50%, 1)', 'hsla(313, 100%, 72%, 1)', 'hsla(229, 100%, 50%, 1)', 'hsla(229, 100%, 72%, 1)']);

  // Set up the stack
  const stack = d3.stack()
      .keys(['Femme(Sport)', 'Femme(NonSport)', 'Homme(Sport)', 'Homme(NonSport)'])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

  // Stack the data
  const stackedasthm = stack(dataAsthme);
  const stackeddiabete = stack(dataDiabete);
  const stackedtension = stack(dataTension);
console.log(stackeddiabete)
  // Set up the x and y scales
  const x = d3.scaleBand()
      .domain(dataAsthme.map(d => d.score))
      .range([2*width/3 + margin.left, width - margin.right])
      .padding(0.1);
const xd = d3.scaleBand()
      .domain(dataDiabete.map(d => d.score))
      .range([margin.left, width/3 - margin.right])
      .padding(0.1);     
 const xt = d3.scaleBand()
      .domain(dataTension.map(d => d.score))
      .range([width/3 + margin.left, 2*width/3- margin.right])
      .padding(0.1);
  const y = d3.scaleLinear()
      .domain([0, d3.max(stackeddiabete, d => d3.max(d, d => d[1]))])
      .rangeRound([height - margin.bottom, margin.top])

  svg1.selectAll('grp1')
      .data(stackedasthm)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.score))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth()).on('mouseover', function (event, d) {
        const data = d.data;
      console.log(d3.pointer(event)[0])
        // Display a tooltip with the relevant information
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
          const rectCenterX = x(d.data.score);  // Center X position
          const rectCenterY = (y(d[1]) + y(d[0])) / 2 ;         // Center Y position
      
          tooltip.text(`nombre: ${d[1] - d[0]}`)
            .attr('x', rectCenterX)
            .attr('y', rectCenterY);
      })
      .on('mouseout', function () {
        // Hide the tooltip on mouseout
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      }); ;

svg1.selectAll('grp2')
      .data(stackedtension)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xt(d.data.score))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', xt.bandwidth()).on('mouseover', function (event, d) {
        const data = d.data;
      console.log(d3.pointer(event)[0])
        // Display a tooltip with the relevant information
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
          const rectCenterX = xt(d.data.score);  // Center X position
          const rectCenterY = (y(d[1]) + y(d[0])) / 2 ;         // Center Y position
      
          tooltip.text(`nombre: ${d[1] - d[0]}`)
            .attr('x', rectCenterX)
            .attr('y', rectCenterY);
      })
      .on('mouseout', function () {
        // Hide the tooltip on mouseout
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      });;

      svg1.selectAll('grp3')
      .data(stackeddiabete)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xd(d.data.score))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', xd.bandwidth()).on('mouseover', function (event, d) {
        const data = d.data;
      console.log(d3.pointer(event)[0])
        // Display a tooltip with the relevant information
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
          const rectCenterX = xd(d.data.score);  // Center X position
          const rectCenterY = (y(d[1]) + y(d[0])) / 2 ;         // Center Y position
      
          tooltip.text(`nombre: ${d[1] - d[0]}`)
            .attr('x', rectCenterX)
            .attr('y', rectCenterY);
      })
      .on('mouseout', function () {
        // Hide the tooltip on mouseout
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      });;

  // Add x-axis
  svg1.append('g')
      .attr('transform', `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(x));

  svg1.append('g')
      .attr('transform', `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(xt));

  svg1.append('g')
      .attr('transform', `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(xd));

  // Add y-axis
  svg1.append("g").attr("transform", "translate(" + ( margin.left) +  ")").call(d3.axisLeft(y));



 
// Create a tooltip element
const tooltip = svg1.append("text")
  .attr("class", "tooltip")
  .style("opacity", 0);

  
 //***** Add legend****/
   // Declare the toggleRectangles function inside run
  
 const legend = svg1.append('g')
 .attr("transform", `translate(${width -margin.right-margin.left}, ${margin.top})`);

const legendRectSize = 18;
const legendSpacing = 4;
 legend.append('text').attr('x', legendRectSize -20+ legendSpacing)
 .attr('y', legendRectSize - legendSpacing-26).text("Sexe(Sport):")
 .style("font-size", "20px").style("color", "rgb(0, 27, 121)"); 
const legendItems = legend.selectAll('.legend-item')
 .data(color.domain())
 .enter().append('g')
 .attr('class', 'legend-item')
 .attr('transform', (d, i) => `translate(0,${i * (legendRectSize + legendSpacing)})`)
 ;

legendItems.append('rect')
 .attr('width', legendRectSize)
 .attr('height', legendRectSize)
 .attr('fill', color);

legendItems.append('text')
 .attr('x', legendRectSize + legendSpacing)
 .attr('y', legendRectSize - legendSpacing)
 .text(d => d);

 /******* */

    
 svg1.append("text")
 .attr("class", "x label")
 .attr("text-anchor", "center")
 .attr("x", (width/3 - margin.right- margin.left)/2)
 .attr("y", height + 10)
 .text("Diabete").style("font-size", "20px");
svg1.append("text")
 .attr("class", "x label")
 .attr("text-anchor", "middle")
 .attr("x", width/2)
 .attr("y", height + 50)
 .text(" Distribution des hommes et femmes  selon le sport l'age  et  maladies chroniques  ").style("font-size", "25px");
 svg1.append("text")
 .attr("class", "x label")
 .attr("text-anchor", "center")
 .attr("x", (width - margin.right - margin.left)/2)
 .attr("y", height + 10)
 .text("Tension").style("font-size", "20px");
 svg1.append("text")
 .attr("class", "x label")
 .attr("text-anchor", "center")
 .attr("x", (6*width/7- margin.right- margin.left))
 .attr("y", height + 10)
 .text("Asthme").style("font-size", "20px");
svg1.append("text")
 .attr("class", "y label")
 .attr("text-anchor", "end")
 .attr("y", 0)
 .attr("dy", ".75em")
 .attr("transform", "rotate(-90)")
 .text("NB personnes");



 /******* */
// Chargement des données
const dataAsthme2 = await fetchData("data/Asthme_file2.csv");
const dataDiabete2 = await fetchData("data/diabete_file2.csv");
const dataTension2 = await fetchData("data/Tension(HTA)_file2.csv");


const svg2 = d3
    .select("#svg2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") 
    
    ;

// Define color scale
const color2 = d3.scaleOrdinal()
    .domain(['Femme(Oui)', 'Femme(Non)', 'Homme(Oui)', 'Homme(Non)'])
    .range([' hsla(313, 100%, 50%, 1)', 'hsla(313, 100%, 72%, 1)', 'hsla(229, 100%, 50%, 1)', 'hsla(229, 100%, 72%, 1)']);

// Set up the stack
const stack2 = d3.stack()
    .keys(['Femme(Oui)', 'Femme(Non)', 'Homme(Oui)', 'Homme(Non)'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

// Stack the data
const stackedasthm2 = stack2(dataAsthme2);
const stackeddiabete2 = stack2(dataDiabete2);
const stackedtension2 = stack2(dataTension2);
console.log(stackeddiabete2)
// Set up the x and y scales
const x2 = d3.scaleBand()
    .domain(dataAsthme2.map(d => d.score))
    .range([2*width/3 + margin.left, width - margin.right])
    .padding(0.1);
const xd2 = d3.scaleBand()
    .domain(dataDiabete2.map(d => d.score))
    .range([margin.left, width/3 - margin.right])
    .padding(0.1);     
const xt2 = d3.scaleBand()
    .domain(dataTension2.map(d => d.score))
    .range([width/3 + margin.left, 2*width/3- margin.right])
    .padding(0.1);
const y2 = d3.scaleLinear()
    .domain([0, d3.max(stackeddiabete2, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom, margin.top])
svg2.selectAll('grp1')
    .data(stackedasthm2)
    .enter().append('g')
    .attr('fill', d => color2(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attr('x', d => x2(d.data.score))
    .attr('y', d => y2(d[1]))
    .attr('height', d => y2(d[0]) - y2(d[1]))
    .attr('width', x2.bandwidth()).on('mouseover', function (event, d) {
      const data = d.data;
    console.log(d3.pointer(event)[0])
      // Display a tooltip with the relevant information
      tooltip2.transition()
        .duration(200)
        .style('opacity', .9);
        const rectCenterX = x2(d.data.score);  // Center X position
        const rectCenterY = (y2(d[1]) + y2(d[0])) / 2 ;         // Center Y position
    
        tooltip2.text(`nombre: ${d[1] - d[0]}`)
          .attr('x', rectCenterX)
          .attr('y', rectCenterY);
    })
    .on('mouseout', function () {
      // Hide the tooltip on mouseout
      tooltip2.transition()
        .duration(100)
        .style('opacity', 0);
    }); ;

svg2.selectAll('grp2')
    .data(stackedtension2)
    .enter().append('g')
    .attr('fill', d => color2(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attr('x', d => xt2(d.data.score))
    .attr('y', d => y2(d[1]))
    .attr('height', d => y2(d[0]) - y2(d[1]))
    .attr('width', xt2.bandwidth()).on('mouseover', function (event, d) {
      const data = d.data;
    console.log(d3.pointer(event)[0])
      // Display a tooltip with the relevant information
      tooltip2.transition()
        .duration(200)
        .style('opacity', .9);
        const rectCenterX = xt2(d.data.score);  // Center X position
        const rectCenterY = (y2(d[1]) + y2(d[0])) / 2 ;         // Center Y position
    
        tooltip2.text(`nombre: ${d[1] - d[0]}`)
          .attr('x', rectCenterX)
          .attr('y', rectCenterY);
    })
    .on('mouseout', function () {
      // Hide the tooltip on mouseout
      tooltip2.transition()
        .duration(100)
        .style('opacity', 0);
    });;

    svg2.selectAll('grp3')
    .data(stackeddiabete2)
    .enter().append('g')
    .attr('fill', d => color2(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attr('x', d => xd2(d.data.score))
    .attr('y', d => y2(d[1]))
    .attr('height', d => y2(d[0]) - y2(d[1]))
    .attr('width', xd2.bandwidth()).on('mouseover', function (event, d) {
      const data = d.data;
    console.log(d3.pointer(event)[0])
      // Display a tooltip with the relevant information
      tooltip2.transition()
        .duration(200)
        .style('opacity', .9);
        const rectCenterX = xd2(d.data.score);  // Center X position
        const rectCenterY = (y2(d[1]) + y2(d[0])) / 2 ;         // Center Y position
    
        tooltip2.text(`nombre: ${d[1] - d[0]}`)
          .attr('x', rectCenterX)
          .attr('y', rectCenterY);
    })
    .on('mouseout', function () {
      // Hide the tooltip on mouseout
      tooltip2.transition()
        .duration(100)
        .style('opacity', 0);
    });;

// Add x-axis
svg2.append('g')
    .attr('transform', `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(x2));

svg2.append('g')
    .attr('transform', `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(xt2));

svg2.append('g')
    .attr('transform', `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(xd2));

// Add y-axis
svg2.append("g").attr("transform", "translate(" + ( margin.left) +  ")").call(d3.axisLeft(y2));




// Create a tooltip element
const tooltip2 = svg2.append("text")
.attr("class", "tooltip2")
.style("opacity", 0);


//***** Add legend****/
 // Declare the toggleRectangles function inside run

const legend2 = svg2.append('g')
.attr("transform", `translate(${width -margin.right-margin.left}, ${margin.top})`);
legend2.append('text').attr('x', legendRectSize -20+ legendSpacing)
.attr('y', legendRectSize - legendSpacing-26).text("Sexe(Fumeur):")
.style("font-size", "20px").style("color", "rgb(0, 27, 121)"); 
const legendItems2 = legend2.selectAll('.legend-item')
.data(color2.domain())
.enter().append('g')
.attr('class', 'legend-item')
.attr('transform', (d, i) => `translate(0,${i * (legendRectSize + legendSpacing)})`)
;

legendItems2.append('rect')
.attr('width', legendRectSize)
.attr('height', legendRectSize)
.attr('fill', color);

legendItems2.append('text')
.attr('x', legendRectSize + legendSpacing)
.attr('y', legendRectSize - legendSpacing)
.text(d => d);

/******* */

  
svg2.append("text")
.attr("class", "x label")
.attr("text-anchor", "center")
.attr("x", (width/3 - margin.right- margin.left)/2)
.attr("y", height +10)
.text("Diabete").style("font-size", "20px") ;
svg2.append("text")
.attr("class", "x label")
.attr("text-anchor", "middle")
.attr("x", width/2)
.attr("y", height + 50)
.text(" Distribution des hommes et femmes fumeurs selon age et  maladies chroniques  ").style("font-size", "25px");
svg2.append("text")
.attr("class", "x label")
.attr("text-anchor", "center")
.attr("x", (width - margin.right - margin.left)/2)
.attr("y", height + 10)
.text("Tension").style("font-size", "20px");
svg2.append("text")
.attr("class", "x label")
.attr("text-anchor", "center")
.attr("x", (6*width/7- margin.right- margin.left))
.attr("y", height + 10)
.text("Asthme").style("font-size", "20px");
svg2.append("text")
.attr("class", "y label")
.attr("text-anchor", "end")
.attr("y", 0)
.attr("dy", ".75em")
.attr("transform", "rotate(-90)")
.text("NB personnes");


 
/*** * */
d3.select("#svg1").style("display", "block");
d3.select("#svg2").style("display", "none");
const buttonShowSvg1 = d3.select("#button");
const buttonShowSvg2 = d3.select("#button1");

buttonShowSvg1.on("click", function() {
    console.log("Button 1 clicked");
    d3.select("#svg1").style("display", "block");
    d3.select("#svg2").style("display", "none");
    console.log("SVG1 displayed, SVG2 hidden");
});

buttonShowSvg2.on("click", function() {
    console.log("Button 2 clicked");
    d3.select("#svg1").style("display", "none");
    d3.select("#svg2").style("display", "block");
    console.log("SVG1 hidden, SVG2 displayed");
});

}



run();