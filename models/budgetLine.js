var mongoose = require('mongoose')
var Schema = mongoose.Schema

var budgetLineSchema = new Schema({
  fy: String,
  id: String,
  fmsId: String,
  description: String,
  totalEstimatedCost: String,
  totalAppropriationAsOf: String,
  appropriationAvailableAsOf: Object,
  fy0: Number,
  fy1: Number,
  fy2: Number,
  fy3: Number,
  requiredToComplete: String,
  maintenanceAndOperation: Number,
  estimatedDateOfCompletion: String
}, { collection: 'capital-budget' })

// Old Schema for Commitments
// var budgetLineSchema = new Schema({
//   fy: String,
//   budgetLineId: String,
//   fmsNumber: String,
//   description: String,
//   availableBalance: Object,
//   contractLiability: Object,
//   itdExpenditures: Object,
//   adoptedAppropriations: Object,
//   commitmentPlan: Object,
//   projects: Array
// }, { collection: 'multiyear' })

module.exports = mongoose.model('BudgetLine', budgetLineSchema)
