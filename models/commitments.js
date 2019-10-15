var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commitmentsSchema = new Schema({
  fy: String,
  budgetLineId: String,
  fmsNumber: String,
  description: String,
  availableBalance: Object,
  contractLiability: Object,
  itdExpenditures: Object,
  adoptedAppropriations: Object,
  commitmentPlan: Object,
  projects: Array
}, { collection: 'multiyear' })

module.exports = mongoose.model('Commitments', commitmentsSchema)
