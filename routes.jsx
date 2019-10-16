const express = require('express')
const BudgetLine = require('./models/budgetLine')
const Commitments = require('./models/commitments')
const router = express.Router()
const slugify = require('slugify')

const types = require('./utils/types')

const lookupType = (type) => {
  const upperCaseType = type.toUpperCase()
  return types.find(d => d.type === upperCaseType).description
}

const reduceTotalAppropriations = {
  $reduce: {
    input: {
      $objectToArray: {
        fy0: {
          $reduce: {
            input: {
              $objectToArray: '$fy0'
            },
            initialValue: 0,
            in: { $add: ['$$value', '$$this.v'] }
          }
        },
        fy1: {
          $reduce: {
            input: {
              $objectToArray: '$fy1'
            },
            initialValue: 0,
            in: { $add: ['$$value', '$$this.v'] }
          }
        },
        fy2: {
          $reduce: {
            input: {
              $objectToArray: '$fy2'
            },
            initialValue: 0,
            in: { $add: ['$$value', '$$this.v'] }
          }
        },
        fy3: {
          $reduce: {
            input: {
              $objectToArray: '$fy3'
            },
            initialValue: 0,
            in: { $add: ['$$value', '$$this.v'] }
          }
        }
      }
    },
    initialValue: 0,
    in: { $add: ['$$value', '$$this.v'] }
  }
}

router.get('/', async (req, res, next) => {
  try {
    let budgetTypes = await BudgetLine.aggregate([
      {
        $project: {
          budgetLineId: '$id',
          projectType: { $split: ['$id', '-'] },
          totalAppropriations: reduceTotalAppropriations
        }
      },
      {
        $group: {
          _id: '$budgetLineId',
          projectType: { $first: '$projectType' },
          totalAppropriations: { $sum: '$totalAppropriations' }
        }
      },
      // {
      //   $addFields: {
      //     projects: {
      //       $reduce: {
      //         input: '$projects',
      //         initialValue: [],
      //         in: { $setUnion: ['$$value', '$$this'] }
      //       }
      //     }
      //   }
      // },
      { $unwind: '$projectType' },
      { $match: { projectType: /^[A-Z]{1,2}$/ } },
      {
        $group: {
          _id: '$projectType',
          budgetLines: { $sum: 1 },
          totalAppropriations: { $sum: '$totalAppropriations' }
          // totalCommitments: { $sum: '$totalCommitments' }
        }
      },
      // {
      //   $addFields: {
      //     projects: {
      //       $size: {
      //         $reduce: {
      //           input: '$projects',
      //           initialValue: [],
      //           in: { $setUnion: ['$$value', '$$this'] }
      //         }
      //       }
      //     }
      //   }
      // },
      { $sort: { totalAppropriations: -1 } }
    ])

    budgetTypes = budgetTypes.map((budgetType) => {

      const description = lookupType(budgetType._id)

      return {
        description,
        ...budgetType
      }
    })

    res.render('index', {
      title: 'NYC Capital Commitment Plan',
      budgetTypes
    })
  } catch (err) { next(err) }
})

// list all budgetlines for a type
router.get('/type/:type/:description', async (req, res, next) => {
  const { type } = req.params
  try {
    const budgetLines = await BudgetLine.aggregate([
      {
        $project: {
          budgetLineId: '$id',
          description: '$description',
          fmsNumber: '$fmsId',
          fy: '$fy',
          totalAppropriations: reduceTotalAppropriations
        }
      },
      {
        $match: {
          budgetLineId: {
            $regex: new RegExp(`^${type.toUpperCase()}-`)
          }
        }
      },
      {
        $group: {
          _id: '$budgetLineId',
          description: { $first: '$description' },
          fmsNumber: { $first: '$fmsNumber' },
          lowFy: { $min: '$fy' },
          highFy: { $max: '$fy' },
          totalAppropriations: { $sum: '$totalAppropriations' }
        }
      },
      { $sort: { totalAppropriations: -1 } }
    ])

    res.render('type', {
      title: 'Project Types',
      budgetLines,
      type,
      typeDisplay: lookupType(type)
    })
  } catch (err) { next(err) }
})

router.get('/api/budgetline/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const data = await BudgetLine
      .find({ id: id.toUpperCase() })
      .sort({ fy: 1 })
    const noProjects = data.map((budgetline) => {
      const {
        fy,
        id,
        appropriationAvailableAsOf,
        fy0,
        fy1,
        fy2,
        fy3
      } = budgetline
      return {
        fy,
        id,
        appropriationAvailableAsOf,
        fy0,
        fy1,
        fy2,
        fy3
      }
    })
    res.json(noProjects)
  } catch (err) { next(err) }
})

router.get('/type/:type/budgetline/:budgetlineid/:description', async (req, res, next) => {
  const { budgetlineid } = req.params
  const budgetLines = await BudgetLine.aggregate([
    {
      $project: {
        fy: '$fy',
        id: '$id',
        description: '$description',
        fmsId: '$fmsId',
        totalAppropriations: reduceTotalAppropriations
      }
    },
    {
      $match: {
        id: {
          $regex: new RegExp(`^${budgetlineid.toUpperCase()}`)
        }
      }
    },
    {
      $group: {
        _id: '$id',
        description: { $first: '$description' },
        fmsNumber: { $first: '$fmsId' },
        totalAppropriations: { $sum: '$totalAppropriations' }
      }
    }
  ])

  const projects = await Commitments.aggregate([
    {
      $project: {
        budgetLineId: '$budgetLineId',
        description: '$description',
        fmsNumber: '$fmsNumber',
        projects: '$projects',
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
          $regex: new RegExp(`^${budgetlineid.toUpperCase()}`)
        }
      }
    },
    { $unwind: '$projects' },
    {
      $group: {
        _id: '$projects.id',
        projectDescription: { $first: '$projects.description' },
        managingAgency: { $first: '$projects.managingAgency' },
        budgetLineId: { $first: '$budgetLineId' },
        description: { $first: '$description' },
        fmsNumber: { $first: '$fmsNumber' },
        totalAppropriations: { $first: '$totalAppropriations' }
      }
    },
    {
      $group: {
        _id: '$budgetLineId',
        description: { $first: '$description' },
        fmsNumber: { $first: '$fmsNumber' },
        totalAppropriations: { $first: '$totalAppropriations' },
        projects: {
          $push: {
            id: '$_id',
            description: '$projectDescription',
            managingAgency: '$managingAgency'
          }
        }
      }
    }
    // {
    //   $addFields: {
    //     projects: {
    //       $reduce: {
    //         input: '$projects',
    //         initialValue: [],
    //         in: { $setUnion: ['$$value', '$$this'] }
    //       }
    //     }
    //   }
    // }
    // { $sort: { totalAppropriations: -1 } }
  ])

  console.log(projects)

  res.render('budgetlinetimeline', { title: 'Budget Line Timeline', budgetLine: budgetLines[0], projects: projects[0] && projects[0].projects })
})

router.get('/search', async (req, res) => {
  const { q } = req.query
  const queryRegex = new RegExp(`.*${q}.*`, 'i')

  let budgetLines = await BudgetLine
    .find({
      $or: [
        { description: queryRegex },
        { id: queryRegex }
      ]
    }, 'id description')
    .limit(20)
    .lean()

  budgetLines = budgetLines.map(({ id, description }) => ({
    type: 'budgetLine',
    id,
    description,
    url: `/type/${id.split('-')[0].toLowerCase()}/budgetline/${id.toLowerCase()}/${slugify(description, { lower: true })}`
  }))

  // let projects = await BudgetLine.aggregate([
  //   { $unwind: '$projects' },
  //   {
  //     $match: {
  //       $or: [
  //         { 'projects.description': queryRegex },
  //         { 'projects.id': queryRegex }
  //       ]
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       budgetLineId: '$budgetLineId',
  //       projectid: '$projects.id',
  //       description: '$projects.description'
  //     }
  //   }
  // ])
  //   .limit(20)
  //
  // projects = projects.map(({ projectid: id, description, budgetLineId }) => ({
  //   type: 'project',
  //   id,
  //   description,
  //   url: `/fy19/type/${budgetLineId.split('-')[0].toLowerCase()}/budgetline/${budgetLineId.toLowerCase()}/project/${id.toLowerCase()}/${slugify(description, { lower: true })}`
  // }))

  res.json([
    ...budgetLines,
    // ...projects
  ])
})

// AG-DN100
module.exports = router
