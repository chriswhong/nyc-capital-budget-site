/* global d3 */
// based on https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

// all fys in our db plus 3 more years
const fys = ['fy08', 'fy09', 'fy10', 'fy11', 'fy12', 'fy13', 'fy14', 'fy15', 'fy16', 'fy17', 'fy18', 'fy19', 'fy20', 'fy21', 'fy22']

const formatCost = (number) => {
  return `$${d3.format('.3s')(number)}`
}

const getTypeLabel = (type) => {
  switch (type) {
    case 'CN':
      return 'City'
    case 'CX':
      return 'City Exempt'
    case 'F':
      return 'Federal'
    case 'S':
      return 'State'
    case 'P':
      return 'Private'
  }
}

const pad = (num, size) => {
  const s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

const checkForType = (data, key) => {
  return data.reduce((acc, curr) => {
    return Object.keys(curr).includes(key)
  }, false)
}

const renderAvailableBalanceChart = (data) => {
  let tipBox // tooltips based on http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929
  const tooltip = d3.select('#tooltip')

  const removeTooltip = () => {
    if (tooltip) tooltip.style('display', 'none')
    if (tooltipLine) tooltipLine.attr('stroke', 'none')
  }

  const renderTooltip = (year) => {
    const balances = availableBalance.find(d => d.asOf === year)
    const types = Object.keys(balances).filter(d => ['CN', 'CX', 'F', 'S', 'P'].includes(d))
    return `
      <div class='tiny'>Available at start of ${year.toUpperCase()}</div>
      <div class='tooltip-items'>
        <div class='tooltip-item total'>${formatCost(balances.total)}</div>
        <hr/>
        ${types.map((type) => {
          return `
            <div class='tooltip-item'><span class='tiny'>${getTypeLabel(type)}:</span> ${formatCost(balances[type])}</div>
          `
        }).join('')}
      </div>
    `
  }

  const drawTooltip = () => {
    const year = xScale.invert(d3.mouse(tipBox.node())[0])

    tooltipLine.attr('stroke', 'black')
      .transition(d3.transition()
        .duration(100)
        .ease(d3.easeLinear)
      )
      .attr('x1', xScale(year))
      .attr('x2', xScale(year))
      .attr('y1', 0)
      .attr('y2', height)

    tooltip
      .style('display', 'block')
      .style('left', `${d3.event.offsetX + 50}px`)
      .style('top', `${d3.event.offsetY - 20}px`)

    tooltip.html(renderTooltip(year))
  }

  const availableBalance = data.map((budgetline) => {
    return {
      asOf: budgetline.fy,
      ...budgetline.appropriationAvailableAsOf,
      total: Object.keys(budgetline.appropriationAvailableAsOf).reduce((acc, key) => {
        return acc + budgetline.appropriationAvailableAsOf[key]
      }, 0)
    }
  })

  const maxCost = d3.max(availableBalance, d => d.total)

  const CONTAINER_SELECTOR = '#available-balance-chart'
  const divWidth = d3.select(CONTAINER_SELECTOR).style('width').slice(0, -2)
  // 2. Use the margin convention practice
  const margin = { top: 50, right: 50, bottom: 50, left: 100 }
  const width = divWidth - margin.left - margin.right // Use the window's width
  const height = 280 - margin.top - margin.bottom // Use the window's height

  // 5. X scale will use the index of our data
  const xScale = d3.scaleBand()
    .domain(fys) // input
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1)

  xScale.invert = function (x) {
    const domain = this.domain()
    const range = this.range()
    const scale = d3.scaleQuantize().domain(range).range(domain)
    return scale(x)
  }

  // 6. Y scale will use the randomly generate number
  const yScale = d3.scaleLinear()
    .domain([0, maxCost]) // input
    .range([height, 0]) // output

  const appendLine = (svg, data, type) => {
    svg.append('path')
      .datum(data)
      .attr('class', `line line-${type}`)
      .attr('d', d3.line()
        .x((d) => xScale(d.asOf))
        .y((d) => yScale(d[type] || 0))
        .curve(d3.curveMonotoneX)
      )

    svg.selectAll(`dot-${type}`)
      .data(data)
      .enter().append('circle') // Uses the enter().append() method
      .attr('class', `dot dot-${type}`)
      .attr('cx', (d) => xScale(d.asOf))
      .attr('cy', (d) => yScale(d[type] || 0))
      .attr('r', 3)
  }

  // 1. Add the SVG to the page and employ #2
  const svg = d3.select(CONTAINER_SELECTOR).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const tooltipLine = svg.append('line')

  // 3. Call the x axis in a group tag
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append('g')
    .attr('class', 'y axis')
    .call(
      d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d3.format('$,.0s'))
    ) // Create an axis component with d3.axisLeft

  // always do total, for subsequent types determine whether the data include that type
  appendLine(svg, availableBalance, 'total')
  const types = ['CN', 'CX', 'F', 'S', 'P']

  types.forEach((type) => {
    if (checkForType(availableBalance, type)) {
      appendLine(svg, availableBalance, type)
    }
  })

  tipBox = svg.append('rect')
    .attr('class', 'tooltip-area')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip)
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

  const yearTotals = fys.map((fy) => {
    // sum all commitmentData for this fy
    return commitmentData.reduce((acc, curr) => {
      return acc + curr[fy]
    }, 0)
  })

  const divWidth = d3.select(CONTAINER_SELECTOR).style('width').slice(0, -2)
  // 2. Use the margin convention practice
  const margin = { top: 50, right: 50, bottom: 50, left: 100 }
  const width = divWidth - margin.left - margin.right // Use the window's width
  const height = 280 - margin.top - margin.bottom // Use the window's height

  // 5. X scale will use the index of our data
  const xScale = d3.scaleBand()
    .domain(fys) // input
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(yearTotals)]) // input
    .range([height, 0]) // output

  // set the colors
  const z = d3.scaleOrdinal()
    .domain(fys)
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

  // 1. Add the SVG to the page and employ #2
  const svg = d3.select(CONTAINER_SELECTOR).append('svg')
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
    .call(
      d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d3.format('$,.0s'))
    )// Create an axis component with d3.axisLeft

  const stacked = d3.stack().keys(fys)(commitmentData)

  svg.selectAll('.serie')
    .data(stacked)
    .enter().append('g')
    .attr('class', 'serie')
    .attr('fill', function (d) { return z(d.key) })
    .selectAll('rect')
    .data(function (d) { return d })
    .enter().append('rect')
    .attr('x', function (d) { return xScale(d.data.baseFy) })
    .attr('y', function (d) { return yScale(d[1]) })
    .attr('height', function (d) { return yScale(d[0]) - yScale(d[1]) })
    .attr('width', xScale.bandwidth())
}

const budgetLineId = window.location.href.split('/')[6]

d3.json(`/api/budgetline/${budgetLineId}`)
  .then((data) => {
    renderAvailableBalanceChart(data)
    // renderCommitmentChart(data)
  })
