/* global d3 */
// based on https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

const parseTime = d3.timeParse('%m/%d/%y')

const parseFyString = (fyString) => {
  const y = fyString.split('fy')[1]
  return d3.timeParse('%m/%d/%y')(`07/1/${y}`)
}

const pad = (num, size) => {
  var s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

const renderAvailableBalanceChart = (data) => {
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
    d.asOf = parseTime(d.asOf)
  })

  const minTime = d3.min(availableBalance, d => d.asOf)
  const maxTime = d3.max(availableBalance, d => d.asOf)

  const maxCost = d3.max(availableBalance, d => d.total)

  const CONTAINER_SELECTOR = '#available-balance-chart'
  const divWidth = d3.select(CONTAINER_SELECTOR).style('width').slice(0, -2)
  // 2. Use the margin convention practice
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var width = divWidth - margin.left - margin.right // Use the window's width
  var height = 200 - margin.top - margin.bottom // Use the window's height

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
  var svg = d3.select(CONTAINER_SELECTOR).append('svg')
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
}

const renderCommitmentChart = (data) => {
  const CONTAINER_SELECTOR = '#commitment-chart'

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
    d.asOf = parseTime(d.asOf)
  })
  const minTime = d3.min(availableBalance, d => d.asOf)
  const maxTime = d3.max(availableBalance, d => d.asOf)

  console.log(minTime, maxTime)
  // all fys in our db plus 3 more years
  const fys = ['fy08', 'fy09', 'fy10', 'fy11', 'fy12', 'fy13', 'fy14', 'fy15', 'fy16', 'fy17', 'fy18', 'fy19', 'fy20', 'fy21', 'fy22']

  const emptyFys = {}
  fys.slice().reverse().forEach((d) => { emptyFys[d] = 0 })
  // make an object for each fy
  const commitmentData = fys.map((fy) => {
    return {
      baseFy: fy,
      ...emptyFys
    }
  })

  // populate the empty fy objects with commitment data
  data.forEach(({ fy, commitmentPlan }) => {
    // for each of the 4 years in the commitmentPlan, set this fy as a key with $
    commitmentPlan.forEach(({ city, nonCity }, i) => {
      const thisFy = `fy${pad(parseInt(fy.split('fy')[1]) + i, 2)}`
      const yearToSet = commitmentData.find(d => d.baseFy === thisFy)
      yearToSet[fy] = city + nonCity
    })
  })

  console.log(commitmentData)

  // data should be transformed to one object per fy, with keys for each fy that allocates money to it

  // [
  //   {
  //     baseFy: date,
  //     fy19: 3400,
  //     fy20: 4800
  //   }
  // ]

  // convert fy to a real time
  // commitmentData.forEach((d) => {
  //   d.baseFyDate = parseFyString(d.baseFy)
  // })

  console.log(commitmentData)

  const divWidth = d3.select(CONTAINER_SELECTOR).style('width').slice(0, -2)
  // 2. Use the margin convention practice
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var width = divWidth - margin.left - margin.right // Use the window's width
  var height = 200 - margin.top - margin.bottom // Use the window's height

  // 5. X scale will use the index of our data
  var xScale = d3.scaleBand()
    .domain(fys) // input
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1)

  var yScale = d3.scaleLinear()
    .domain([0, 200000000]) // input
    .range([height, 0]) // output

  // set the colors
  var z = d3.scaleOrdinal()
    .domain(fys)
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

  // 1. Add the SVG to the page and employ #2
  var svg = d3.select(CONTAINER_SELECTOR).append('svg')
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
  const stack = d3.stack()

  console.log('stacking', stack.keys(fys)(commitmentData))
  svg.selectAll('.serie')
    .data(stack.keys(fys)(commitmentData))
    .enter().append('g')
    .attr('class', 'serie')
    .attr('fill', function (d) { return z(d.key) })
    .selectAll('rect')
    .data(function (d) { return d })
    .enter().append('rect')
    .attr('x', function (d) { console.log(d.data); return xScale(d.data.baseFy) })
    .attr('y', function (d) { return yScale(d[1]) })
    .attr('height', function (d) { return yScale(d[0]) - yScale(d[1]) })
    .attr('width', xScale.bandwidth())
}

d3.json('/api/budgetline/hb-1070/bridge-painting-citywide')
  .then((data) => {
    renderAvailableBalanceChart(data)
    renderCommitmentChart(data)
  })
