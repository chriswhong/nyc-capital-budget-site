const React = require('react')
const DefaultLayout = require('./layouts/default')

const { toTitleCase, formatMoney, agencyLookup } = require('../utils/helpers')

const BudgetlineTimeline = ({ title, budgetLine }) => {
  const {
    budgetLineId,
    fmsNumber,
    description,
    totalAppropriations,
    projects
  } = budgetLine

  return (
    <DefaultLayout title={title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='title-heading'>Budget Line {budgetLineId}</div>
            <div className='title-heading'>FMS Number {fmsNumber}</div>
            <h1 className='mb-4'>{toTitleCase(description)}</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='total-container'>
              <h6>Total Appropriations</h6>
              <div className='big-money'>{formatMoney(totalAppropriations)}</div>
            </div>
          </div>
          <div className='col-6'>
            <div className='total-container'>
              <h6>Capital Projects</h6>
              <div className='big-money'>{projects.length}</div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <h4>Available balance FY08-FY22</h4>
            <div id='available-balance-chart' />
            <h4>4-year rolling Commitment plans FY08-FY19</h4>
            <div id='commitment-chart' />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            {
              projects.map((project) => {
                console.log(project)
                const { id, description, managingAgency } = project
                return (
                  <div key={id} className='card mb-3'>
                    <div className='card-body'>
                      <div className='title-heading'>Project ID: {id}</div>
                      <div className='title-heading'>Managed By: {agencyLookup(managingAgency)}</div>
                      <h3 className='mb-4'>{toTitleCase(description)}</h3>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = BudgetlineTimeline
