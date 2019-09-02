const express = require('express')
const BudgetLine = require('./models/budgetLine')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('O HAI THERE')
})

router.get('/budgetline/:budgetlineid', async (req, res, next) => {
  try {
    const budgetLine = await BudgetLine.findOne({ budgetLineId: 'AG-DN100' })
    res.render('budgetLine', { title: 'budget Line', budgetLine })
  } catch (err) { next(err) }
})

// AG-DN100
module.exports = router
