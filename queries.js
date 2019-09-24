
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
