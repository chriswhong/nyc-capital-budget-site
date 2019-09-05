var mongoose = require('mongoose')
var Schema = mongoose.Schema

const generateSchema = (collection) => {
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
  }, { collection })

  return mongoose.model('BudgetLine', budgetLineSchema)
}

module.exports = {
  generateSchema
}
