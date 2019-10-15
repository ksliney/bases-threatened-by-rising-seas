import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 35, left: 30, right: 15, bottom: 20 }

var height = 225 - margin.top - margin.bottom
var width = 200 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-4')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 9])
  .range([height, 0])

// Create a d3.line function that uses your scales

var mid = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.mid))


var high = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.high))


// Read in your data

d3.csv(require('./kingsbay.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.location
    })
    .entries(datapoints)

  // xPositionScale domain

  var minAge = d3.min(datapoints, function(d) {
    return d.year
  })

  var maxAge = d3.max(datapoints, function(d) {
    return d.year
  })

  xPositionScale.domain([minAge, maxAge])

  container
    .selectAll('.searise-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'searise-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // going through each SVG one by one
      var svg = d3.select(this)

      // mid-level scenario

      svg
        .append('path')
        .datum(d.values)
        .attr('d', mid)
        .attr('stroke', '#3182bd')
        .attr('stroke-width', 2)
        .attr('class', 'mid-scenario-slr')
        .attr('fill', 'none')

     // high-level scenario

      svg
        .append('path')
        .datum(d.values)
        .attr('d', high)
        .attr('stroke', '#9ecae1')
        .attr('stroke-width', 2)
        .attr('class', 'high-scenario-slr')
        .attr('fill', 'none')

      // 'Kings Bay' Title

      svg
        // .attr('transform', `rotate(-5 0 ${height})`)
        .append('text')
        .attr('font-size', 12)
        .attr('y', -5)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Arial')
        .text(function(d) {
          return d.key
        })

      svg
       .append('text')
       .attr('font-size', 11)
       .attr('y', 75)
       .attr('x', 75)
       .attr('fill', '#9ecae1')
       .attr('font-family', 'Arial')
       .text('highest')


      // Axis
      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat(d3.format(''))
        .tickSize(-height)
        .tickValues([2025,2050,2075,2100])

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)


      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d => d3.format(',')(d) + 'ft')
        .tickSize(-width)
        .tickValues([2,4,6,8])


      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)


     
      d3.selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')

      d3.selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
 

  // REMOVE THOSE THINGS

  d3.selectAll('.x-axis .domain').remove()
  d3.selectAll('.y-axis .domain').remove()


    })
}



export {xPositionScale, yPositionScale, width, height}