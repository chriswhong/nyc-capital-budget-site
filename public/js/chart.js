// based on https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

const parseTime = d3.timeParse('%m/%d/%y')

console.log(parseTime('08/27/19'))

const renderChart = (data) => {
  console.log(data)
  const availableBalance = data.map((budgetline) => {
    const { asOf, city, nonCity, total } = budgetline.availableBalance
    return {
      asOf,
      city,
      nonCity,
      total
    }
  })

  availableBalance.forEach((d) => {
    console.log(parseTime(d.asOf))
    d.asOf = parseTime(d.asOf)
  })

  const minTime = d3.min(availableBalance, d => d.asOf)
  const maxTime = d3.max(availableBalance, d => d.asOf)

  const maxCost = d3.max(availableBalance, d => d.total)

  console.log(availableBalance)
  const chartContainer = d3.select('#chart')

  const divWidth = d3.select('#chart').style('width').slice(0, -2)
  // 2. Use the margin convention practice
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var width = divWidth - margin.left - margin.right // Use the window's width
  var height = 200 - margin.top - margin.bottom // Use the window's height
  // The number of datapoints
  var n = 21

  // 5. X scale will use the index of our data
  var xScale = d3.scaleTime()
    .domain([d3.timeYear.offset(minTime, -1), d3.timeYear.offset(maxTime, 1)]) // input
    .range([0, width]) // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
    .domain([0, maxCost]) // input
    .range([height, 0]) // output

  // 7. d3's line generator
  var line = d3.line()
    .x((d) => xScale(d.asOf)) // set the x values for the line generator
    .y((d) => yScale(d.total)) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  var lineCity = d3.line()
    .x((d) => xScale(d.asOf)) // set the x values for the line generator
    .y((d) => yScale(d.city)) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  var lineNonCity = d3.line()
    .x((d) => xScale(d.asOf)) // set the x values for the line generator
    .y((d) => yScale(d.nonCity)) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 1. Add the SVG to the page and employ #2
  var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // 3. Call the x axis in a group tag
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg.append('path')
    .datum(availableBalance) // 10. Binds data to the line
    .attr('class', 'line line-total') // Assign a class for styling
    .attr('d', line) // 11. Calls the line generator

  // 9. Append the path, bind the data, and call the line generator
  svg.append('path')
    .datum(availableBalance) // 10. Binds data to the line
    .attr('class', 'line line-city') // Assign a class for styling
    .attr('d', lineCity) // 11. Calls the line generator

  // 9. Append the path, bind the data, and call the line generator
  svg.append('path')
    .datum(availableBalance) // 10. Binds data to the line
    .attr('class', 'line line-noncity') // Assign a class for styling
    .attr('d', lineNonCity) // 11. Calls the line generator

  // 12. Appends a circle for each datapoint
  svg.selectAll('.dot')
    .data(availableBalance)
    .enter().append('circle') // Uses the enter().append() method
    .attr('class', 'dot') // Assign a class for styling
    .attr('cx', (d) => xScale(d.asOf))
    .attr('cy', (d) => yScale(d.total))
    .attr('r', 5)
  //   .on('mouseover', function (a, b, c) {
  //   			console.log(a)
  //     this.attr('class', 'focus')
  //   })
  //   .on('mouseout', function () { })
}

d3.json('/api/budgetline/hb-1070/bridge-painting-citywide')
  .then(renderChart)
