const fs = require('fs-extra')
const readline = require('readline')

// fs.ensureFileSync(outputPath);
// const output = fs.createWriteStream(outputPath);

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

let budgetLineObject = null
let capitalProjects = []
let capitalProjectObject = {}
let commitmentDetails = []

// { // budgetLineObject
//   ...,
//   projects: [ // capitalProjects
//     ...,
//     commitmentDetails: [
//       ...
//     ]
//   ]
// }

const closeCapitalProject = () => {
  // add the array of commitmentdetails to the current project
  capitalProjectObject.commitmentDetails = commitmentDetails
  commitmentDetails = [] // reset

  // if the capital project exists, push it to the capitalProjects array
  capitalProjectObject.id && capitalProjects.push(capitalProjectObject)
  capitalProjectObject = {} // reset
}

// wrap up all running values and output a complete budgetLineItem
const closeBudgetLineObject = () => {
  // close up the last project
  closeCapitalProject()

  budgetLineObject.projects = capitalProjects
  console.log('Complete Budget Line', JSON.stringify(budgetLineObject, null, 2))

  // reset all the things
  budgetLineObject = null
  capitalProjects = []
  commitmentDetails = []
}

const parseLine = (line) => {
  // check for patterns of new budget line, new project, or commitment
  if (/BUDGET LINE/.test(line)) { // new budget line
    budgetLineObject && closeBudgetLineObject()

    budgetLineObject = {}

    budgetLineObject.budgetLine = line.match(/BUDGET LINE:(.*)FMS/)[1].trim()
    budgetLineObject.fmsNumber = line.match(/FMS #:(.{1,10}).*/)[1].trim()
    budgetLineObject.description = line.match(/FMS #:.{1,10}(.*)/)[1].trim()

    return
  }

  if (/TOTALS FOR/.test(line)) {
    console.log('HERE', commitmentDetails)
    // if we hit a totals for line, close out the current budgetLineObject
    budgetLineObject && closeBudgetLineObject()
  }

  if (budgetLineObject) { // don't match any other lines unless there's a budgetLineObject
    if (/AVAILABLE BALANCE AS OF/.test(line)) {
      if (budgetLineObject.budgetLine && !budgetLineObject.availableBalance) { // only log values if following a budget line heading (exclude totals)
        const asOf = line.match(/\d{2}\/\d{2}\/\d{2}/)[0]
        const { city, nonCity } = parseBudgetLineHeaders(line)
        budgetLineObject.availableBalance = {
          asOf,
          city,
          nonCity,
          total: city + nonCity
        }
      }

      return
    }

    if (/CONTRACT LIABILITY/.test(line)) {
      if (budgetLineObject.budgetLine && !budgetLineObject.contractLiability) { // only log values if following a budget line heading (exclude totals)
        const { city, nonCity } = parseBudgetLineHeaders(line)

        budgetLineObject.contractLiability = {
          city,
          nonCity
        }
      }

      return
    }

    if (/ITD EXPENDITURES/.test(line)) {
      if (budgetLineObject.budgetLine && !budgetLineObject.itdExpenditures) { // only log values if following a budget line heading (exclude totals)
        const { city, nonCity } = parseBudgetLineHeaders(line)

        budgetLineObject.itdExpenditures = {
          city,
          nonCity
        }
      }

      return
    }

    if (/ADOPTED/.test(line)) {
      if (budgetLineObject.budgetLine && !budgetLineObject.adoptedAppropriations) { // only log values if following a budget line heading (exclude totals)
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

        budgetLineObject.adoptedAppropriations = {
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

        budgetLineObject.commitmentPlan = {
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

      return
    }

    if (/^\s*\(N\)*/.test(line)) {
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

      const { adoptedAppropriations, commitmentPlan } = budgetLineObject
      adoptedAppropriations.fy19.nonCity = formatCost(adoptedFY19NonCity)
      adoptedAppropriations.fy20.nonCity = formatCost(adoptedFY20NonCity)
      adoptedAppropriations.fy21.nonCity = formatCost(adoptedFY21NonCity)
      adoptedAppropriations.fy22.nonCity = formatCost(adoptedFY22NonCity)

      commitmentPlan.fy19.nonCity = formatCost(commitmentFY19NonCity)
      commitmentPlan.fy20.nonCity = formatCost(commitmentFY20NonCity)
      commitmentPlan.fy21.nonCity = formatCost(commitmentFY21NonCity)
      commitmentPlan.fy22.nonCity = formatCost(commitmentFY22NonCity)

      return
    }

    if (/^\s*\d{3}\s/.test(line)) { // beginning of new capital project
      closeCapitalProject()

      capitalProjectObject.managingAgency = line.match(/\d{3}/)[0]
      capitalProjectObject.id = line.match(/\d{3}(.{1,10})/)[1].trim()
      capitalProjectObject.description = `${line.match(/\d{3}.{1,10}(.{1,62})/)[1].replace(/"/g, '').replace(/ +(?= )/g, '').trim()}`
    }
    console.log(line)
    if (/\s[A-Z]{4}\s.{1,5}\s\d{3}\s/.test(line)) { // commitments
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

      commitmentDetails.push(commitDetailObject)
    }
  }

  return null
}

// run this script like >node scrape path to txt file
const readInterface = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
  console: false
})

readInterface.on('line', (line) => {
  parseLine(line)
})
