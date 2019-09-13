const React = require('react')
const DefaultLayout = require('./layouts/default')

const BudgetlineTimeline = (props) => {

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div id='available-balance-chart' />
            <div id='commitment-chart' />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = BudgetlineTimeline
