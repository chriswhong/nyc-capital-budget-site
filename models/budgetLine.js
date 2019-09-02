var mongoose = require('mongoose')
var Schema = mongoose.Schema

var budgetLineSchema = new Schema({
  budgetLineId: String,
  fmsNumber: String,
  description: String,
  availableBalance: Object,
  contractLiability: Object,
  itdExpenditures: Object,
  adoptedAppropriations: Object,
  commitmentPlan: Object,
  projects: Array
}, { collection: 'ccp-10-18' })

module.exports = mongoose.model('BudgetLine', budgetLineSchema)
