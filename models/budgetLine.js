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
  fy0: Object,
  fy1: Object,
  fy2: Object,
  fy3: Object,
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
