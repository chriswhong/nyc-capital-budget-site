const express = require('express')
const { generateSchema } = require('./models/budgetLine')
const router = express.Router()
const slugify = require('slugify')

const types = require('./utils/types')

const lookupType = (type) => {
  const upperCaseType = type.toUpperCase()
  return types.find(d => d.type === upperCaseType).description
}

const schemaMap = {
  fy19: generateSchema('ccp-10-18')
}

router.get('/', (req, res) => {
  res.redirect('/fy19')
})

// list all budgetlines for a type
router.get('/:fy/type/:type/:description', async (req, res, next) => {
  const { fy, type } = req.params
  try {
    const BudgetLine = schemaMap[fy]
    const budgetLines = await BudgetLine.aggregate([
      {
        $project: {
          budgetLineId: '$budgetLineId',
          description: '$description',
          fmsNumber: '$fmsNumber',
          projectCount: { $size: '$projects' },
          totalAppropriations: {
            $reduce: {
              input: {
                $map: {
                  input: '$adoptedAppropriations',
                  in: { $sum: ['$$this.city', '$$this.nonCity'] }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] }
            }
          },
          totalCommitments: {
            $reduce: {
              input: {
                $map: {
                  input: '$commitmentPlan',
                  in: { $sum: ['$$this.city', '$$this.nonCity'] }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] }
            }
          }
        }
      },
      {
        $match: {
          budgetLineId: {
            $regex: new RegExp(`^${type.toUpperCase()}-`)
          }
        }
      },
      { $sort: { totalCommitments: -1 } }
    ])

    res.render('type', {
      title: 'Project Types',
      budgetLines,
      type,
      typeDisplay: lookupType(type),
      fy
    })
  } catch (err) { next(err) }
})

// list all budgetlines
router.get('/budgetlines', async (req, res, next) => {
  try {
    const BudgetLine = schemaMap[req.params.fy]
    const budgetLines = await BudgetLine.find({}).select('budgetLineId description')
    res.render('budgetlines', { title: 'budget Lines', budgetLines })
  } catch (err) { next(err) }
})

router.get('/:fy/type/:type/budgetline/:budgetlineid/:description', async (req, res, next) => {
  const { fy, type, budgetlineid } = req.params
  try {
    const BudgetLine = schemaMap[fy]
    const [data] = await BudgetLine.aggregate([
      {
        $project: {
          budgetLineId: '$budgetLineId',
          fmsNumber: '$fmsNumber',
          description: '$description',
          availableBalance: '$availableBalance',
          contractLiability: '$contractLiability',
          itdExpenditures: '$itdExpenditures',
          adoptedAppropriations: '$adoptedAppropriations',
          commitmentPlan: '$commitmentPlan',
          projects: {
            $map: {
              input: '$projects',
              in: {
                managingAgency: '$$this.managingAgency',
                id: '$$this.id',
                description: '$$this.description',
                commitmentCount: { $size: '$$this.commitments' },
                totalCommitments: {
                  $reduce: {
                    input: {
                      $map: {
                        input: '$$this.commitments',
                        in: { $sum: ['$$this.cost.city', '$$this.cost.nonCity'] }
                      }
                    },
                    initialValue: 0,
                    in: { $add: ['$$value', '$$this'] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          budgetLineId: budgetlineid.toUpperCase()
        }
      }
    ])

    res.render('budgetlines', {
      title: 'budget Line',
      data,
      fy,
      type
    })
  } catch (err) { next(err) }
})

router.get('/:fy/type/:type/budgetline/:budgetlineid/project/:projectid/:description', async (req, res, next) => {
  const { fy, type, projectid } = req.params
  try {
    const BudgetLine = schemaMap[fy]
    const { projects } = await BudgetLine.findOne({
      projects: {
        $elemMatch: {
          id: req.params.projectid.toUpperCase()
        }
      }
    })

    const project = projects.find(d => d.id.toLowerCase() === projectid)
    res.render('project', {
      title: 'budget Line',
      project,
      fy,
      type
    })
  } catch (err) { next(err) }
})

router.get('/search', async (req, res) => {
  const { q } = req.query
  const queryRegex = new RegExp(`.*${q}.*`, 'i')
  const BudgetLine = schemaMap.fy19

  let budgetLines = await BudgetLine
    .find({
      $or: [
        { description: queryRegex },
        { budgetLineId: queryRegex }
      ]
    }, 'budgetLineId description')
    .limit(20)
    .lean()

  budgetLines = budgetLines.map(({ budgetLineId: id, description }) => ({
    type: 'budgetLine',
    id,
    description,
    url: `/fy19/type/${id.split('-')[0].toLowerCase()}/budgetline/${id.toLowerCase()}/${slugify(description, { lower: true })}`
  }))

  let projects = await BudgetLine.aggregate([
    { $unwind: '$projects' },
    {
      $match: {
        $or: [
          { 'projects.description': queryRegex },
          { 'projects.id': queryRegex }
        ]
      }
    },
    {
      $project: {
        _id: 0,
        budgetLineId: '$budgetLineId',
        projectid: '$projects.id',
        description: '$projects.description'
      }
    }
  ])
    .limit(20)

  projects = projects.map(({ projectid: id, description, budgetLineId }) => ({
    type: 'project',
    id,
    description,
    url: `/fy19/type/${budgetLineId.split('-')[0].toLowerCase()}/budgetline/${budgetLineId.toLowerCase()}/project/${id.toLowerCase()}/${slugify(description, { lower: true })}`
  }))

  res.json([
    ...budgetLines,
    ...projects
  ])
})

router.get('/:fy', async (req, res, next) => {
  const { fy } = req.params
  try {
    const BudgetLine = schemaMap[fy]
    let budgetTypes = await BudgetLine.aggregate([
      {
        $project: {
          projectType: { $split: ['$budgetLineId', '-'] },
          projectCount: { $size: '$projects' },
          totalAppropriations: {
            $reduce: {
              input: {
                $map: {
                  input: '$adoptedAppropriations',
                  in: { $sum: ['$$this.city', '$$this.nonCity'] }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] }
            }
          },
          totalCommitments: {
            $reduce: {
              input: {
                $map: {
                  input: '$commitmentPlan',
                  in: { $sum: ['$$this.city', '$$this.nonCity'] }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] }
            }
          }
        }
      },
      { $unwind: '$projectType' },
      { $match: { projectType: /^[A-Z]{1,2}$/ } },
      {
        $group: {
          _id: '$projectType',
          budgetLines: { $sum: 1 },
          projects: { $sum: '$projectCount' },
          totalAppropriations: { $sum: '$totalAppropriations' },
          totalCommitments: { $sum: '$totalCommitments' }
        }
      },
      { $sort: { totalCommitments: -1 } }
    ])

    budgetTypes = budgetTypes.map((budgetType) => {
      const description = lookupType(budgetType._id)

      return {
        description,
        ...budgetType
      }
    })
    res.render('index', {
      title: `NYC ${fy.toUpperCase()} Capital Commitment Plan`,
      budgetTypes,
      fy
    })
  } catch (err) { next(err) }
})

// AG-DN100
module.exports = router
