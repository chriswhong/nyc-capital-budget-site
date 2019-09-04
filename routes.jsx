const express = require('express')
const BudgetLine = require('./models/budgetLine')
const router = express.Router()
const types = require('./utils/types')

const lookupType = (type) => {
  const upperCaseType = type.toUpperCase()
  return types.find(d => d.type === upperCaseType).description
}

router.get('/', async (req, res, next) => {
  try {
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
    res.render('index', { title: 'Capital Commitments', budgetTypes })
  } catch (err) { next(err) }
})

// list all budgetlines for a type
router.get('/types/:type/:description', async (req, res, next) => {
  const { type } = req.params
  try {
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
            $regex: new RegExp(`^${type.toUpperCase()}`)
          }
        }
      },
      { $sort: { totalCommitments: -1 } }
    ])

    res.render('budgetLines', {
      title: 'budget Lines',
      budgetLines,
      type: lookupType(type)
    })
  } catch (err) { next(err) }
})

// list all budgetlines
router.get('/budgetlines', async (req, res, next) => {
  try {
    const budgetLines = await BudgetLine.find({}).select('budgetLineId description')
    res.render('budgetLines', { title: 'budget Lines', budgetLines })
  } catch (err) { next(err) }
})

router.get('/budgetlines/:budgetlineid/:description', async (req, res, next) => {
  try {
    const [budgetLine] = await BudgetLine.aggregate([
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
          budgetLineId: req.params.budgetlineid
        }
      }
    ])

    res.render('budgetLine', { title: 'budget Line', budgetLine: budgetLine })
  } catch (err) { next(err) }
})

router.get('/projects/:projectid/:description', async (req, res, next) => {
  try {
    const { projects } = await BudgetLine.findOne({
      projects: {
        $elemMatch: {
          id: req.params.projectid.toUpperCase()
        }
      }
    })

    const project = projects.find(d => d.id.toLowerCase() === req.params.projectid)
    console.log(project)
    res.render('project', { title: 'budget Line', project })
  } catch (err) { next(err) }
})

// AG-DN100
module.exports = router
