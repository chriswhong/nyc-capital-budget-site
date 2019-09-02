const React = require('react')
const DefaultLayout = require('./layouts/default')

const HelloMessage = (props) => {
  const { budgetLineId, fmsNumber, description } = props.budgetLine
  return (
    <DefaultLayout title={props.title}>
      <div>
        <h3>{description}</h3>
        <h5>Budget Line {budgetLineId}</h5>
        <h5>FMS Number {fmsNumber}</h5>

      </div>
    </DefaultLayout>
  )
}

module.exports = HelloMessage
