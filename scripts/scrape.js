const fs = require('fs-extra')
const readline = require('readline')

const inputDir = process.argv[2]

const formatCost = (rawCost) => {
  let negative = false
  if (rawCost.includes('-')) negative = true

  let formattedCost = parseInt(rawCost.replace(/,/g, ''), 10) * 1000

  if (negative) formattedCost *= -1

  return formattedCost
}

const sanitizeAsOfNumbers = (raw) => {
  return parseFloat(raw.replace(/,/g, ''))
}

// parses city and noncity numbers from budget line headers
const parseBudgetLineHeaders = (line) => {
  const city = sanitizeAsOfNumbers(line.match(/\$(.*)\(CITY\)/)[1].trim())
  const nonCity = sanitizeAsOfNumbers(line.match(/\$.*\$(.*)\(NON-CITY\)/)[1].trim())

  return { city, nonCity }
}

const parseLine = (line, budgetLine) => {
  // const closeCapitalProject = () => {
  //   // add the array of commitmentdetails to the current project
  //   capitalProjectObject.commitmentDetails = commitmentDetails
  //   commitmentDetails = [] // reset
  //
  //   // if the capital project exists, push it to the capitalProjects array
  //   capitalProjectObject.id && capitalProjects.push(capitalProjectObject)
  //   capitalProjectObject = {} // reset
  // }

  // // wrap up all running values and output a complete budgetLineItem
  // const closeBudgetLineObject = () => {
  //   // close up the last project
  //   closeCapitalProject()
  //
  //   budgetLineObject.projects = capitalProjects
  //   // console.log('Complete Budget Line', JSON.stringify(budgetLineObject, null, 2))
  //   output.write(`${i > 0 ? ',' : ''}${JSON.stringify(budgetLineObject, null, 2)}`)
  //
  //   i += 1
  //   // reset all the things
  //   budgetLineObject = null
  //   capitalProjects = []
  //   commitmentDetails = []
  // }
  // check for patterns of new budget line, new project, or commitment
  if (/BUDGET LINE/.test(line)) { // new budget line
    budgetLine.budgetLineId = line.match(/BUDGET LINE:(.*)FMS/)[1].trim()
    budgetLine.fmsNumber = line.match(/FMS #:(.{1,10}).*/)[1].trim()
    budgetLine.description = line.match(/FMS #:.{1,10}(.*)/)[1].trim()
    console.log('New Budget Line', budgetLine.description)
  } else if (/AVAILABLE BALANCE AS OF/.test(line)) {
    if (budgetLine.budgetLineId && !budgetLine.availableBalance) { // only log values if following a budget line heading (exclude totals)
      const asOf = line.match(/\d{2}\/\d{2}\/\d{2}/)[0]
      const { city, nonCity } = parseBudgetLineHeaders(line)
      budgetLine.availableBalance = {
        asOf,
        city,
        nonCity,
        total: city + nonCity
      }
    }
  } else if (/CONTRACT LIABILITY/.test(line)) {
    if (budgetLine.budgetLineId && !budgetLine.contractLiability) { // only log values if following a budget line heading (exclude totals)
      const { city, nonCity } = parseBudgetLineHeaders(line)

      budgetLine.contractLiability = {
        city,
        nonCity
      }
    }
  } else if (/ITD EXPENDITURES/.test(line)) {
    if (budgetLine.budgetLineId && !budgetLine.itdExpenditures) { // only log values if following a budget line heading (exclude totals)
      const { city, nonCity } = parseBudgetLineHeaders(line)

      budgetLine.itdExpenditures = {
        city,
        nonCity
      }
    }
  } else if (/ADOPTED/.test(line)) {
    if (budgetLine.budgetLineId && !budgetLine.adoptedAppropriations) { // only log values if following a budget line heading (exclude totals)
      const [,
        adoptedFY19City,
        adoptedFY20City,
        adoptedFY21City,
        adoptedFY22City,
        ,
        commitmentFY19City,
        commitmentFY20City,
        commitmentFY21City,
        commitmentFY22City
      ] = line.split('*')

      budgetLine.adoptedAppropriations = {
        fy19: {
          city: formatCost(adoptedFY19City)
        },
        fy20: {
          city: formatCost(adoptedFY20City)
        },
        fy21: {
          city: formatCost(adoptedFY21City)
        },
        fy22: {
          city: formatCost(adoptedFY22City)
        }
      }

      budgetLine.commitmentPlan = {
        fy19: {
          city: formatCost(commitmentFY19City)
        },
        fy20: {
          city: formatCost(commitmentFY20City)
        },
        fy21: {
          city: formatCost(commitmentFY21City)
        },
        fy22: {
          city: formatCost(commitmentFY22City)
        }
      }
    }
  } else if (/^\s*\(N\)*/.test(line)) {
    const [,
      adoptedFY19NonCity,
      adoptedFY20NonCity,
      adoptedFY21NonCity,
      adoptedFY22NonCity,
      ,
      commitmentFY19NonCity,
      commitmentFY20NonCity,
      commitmentFY21NonCity,
      commitmentFY22NonCity
    ] = line.split('*')

    const { adoptedAppropriations, commitmentPlan } = budgetLine
    adoptedAppropriations.fy19.nonCity = formatCost(adoptedFY19NonCity)
    adoptedAppropriations.fy20.nonCity = formatCost(adoptedFY20NonCity)
    adoptedAppropriations.fy21.nonCity = formatCost(adoptedFY21NonCity)
    adoptedAppropriations.fy22.nonCity = formatCost(adoptedFY22NonCity)

    commitmentPlan.fy19.nonCity = formatCost(commitmentFY19NonCity)
    commitmentPlan.fy20.nonCity = formatCost(commitmentFY20NonCity)
    commitmentPlan.fy21.nonCity = formatCost(commitmentFY21NonCity)
    commitmentPlan.fy22.nonCity = formatCost(commitmentFY22NonCity)
  } else if (/^\s*\d{3}\s/.test(line)) { // beginning of new capital project
    if (budgetLine.budgetLineId) {
      const project = budgetLine.projects[budgetLine.projects.length - 1]
      project.managingAgency = line.match(/\d{3}/)[0]
      project.id = line.match(/\d{3}(.{1,10})/)[1].trim()
      project.description = `${line.match(/\d{3}.{1,10}(.{1,62})/)[1].replace(/"/g, '').replace(/ +(?= )/g, '').trim()}`
      console.log('    Capital Project', project.description)
    }
  } else if (/\s[A-Z]{4}\s.{2}\s\S{1,3}\s/.test(line)) { // commitments
    if (budgetLine.budgetLineId) {
      const project = budgetLine.projects[budgetLine.projects.length - 1]
      const category = line.substring(18, 22)
      const subcategory = line.substring(23, 25).trim()
      const code = line.substring(26, 29)
      const categoryDescription = line.substring(30, 59).trim()
      const subcategoryDescription = line.substring(59, 87).trim()

      // numbers/dates
      const chunks = line.substring(84, line.length).trim().split(/\s+/)
      const cityCost = formatCost(chunks[0])
      const nonCityCost = formatCost(chunks[1])
      const planCommDate = chunks[2]

      const commitDetailObject = {
        code,
        category,
        categoryDescription,
        subcategory,
        subcategoryDescription,
        cost: {
          city: cityCost,
          nonCity: nonCityCost
        },
        planCommDate
      }

      project.commitments.push(commitDetailObject)
      console.log(line)
      console.log('        Commitment', categoryDescription)
    }
  }

  return budgetLine
}

const parseTxtFile = (inputDir, file) => {
  console.log(inputDir, file)
  // create an output file, add open array bracket
  const outputPath = `../data/ccp-10-18/json/${file.split('.')[0]}.json`
  fs.ensureFileSync(outputPath)
  const output = fs.createWriteStream(outputPath)
  output.write('[\n')

  const readInterface = readline.createInterface({
    input: fs.createReadStream(`${inputDir}/${file}`),
    console: false
  })

  let i = 0
  let budgetLine = {
    projects: []
  }

  readInterface.on('line', (line) => {
    // check to see if current line closes previous budgetLine
    // if so, write it to file and reset before proceeding
    const closeBudgetLine = !!/TOTALS FOR/.test(line) || !!/BUDGET LINE/.test(line)
    if (closeBudgetLine && budgetLine.budgetLineId) {
      output.write(`${i > 0 ? ',' : ''}${JSON.stringify(budgetLine, null, 2)}`)
      i += 1
      budgetLine = {
        projects: []
      }
    }

    // if the line should start a new capital project, insert an empty object into budgetline.projects
    if (budgetLine.budgetLineId && /^\s*\d{3}\s/.test(line)) {
      budgetLine.projects.push({
        commitments: []
      })
    }

    budgetLine = parseLine(line, budgetLine)
  })

  readInterface.on('close', () => {
    output.write(']')
  })
}

const files = fs.readdirSync(`${inputDir}`)
files.forEach((file) => {
  console.log(`Parsing ${inputDir}/${file}`)
  parseTxtFile(inputDir, file)
})
