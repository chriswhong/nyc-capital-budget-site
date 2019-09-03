const numeral = require('numeral')
const agencies = require('./agencies')

const formatMoney = (amount) => numeral(amount).format('($ 0.00 a)').toUpperCase()

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  )
}

const formatTableValue = (value) => {
  return value ? formatMoney(value) : '--'
}

const agencyLookup = (code) => {
  return agencies.find(d => d.code === code).agency
}

module.exports = {
  agencyLookup,
  formatMoney,
  toTitleCase,
  formatTableValue
}
