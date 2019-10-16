const React = require('react')
const DefaultLayout = require('./layouts/default')
const { agencyLookup } = require('../utils/helpers')
const { toTitleCase, formatMoney } = require('../utils/helpers')

const LegendItem = ({ type, label }) => (
  <div className='legend-item d-flex align-items-center'>
    <svg width='22px' height='10px' viewBox='0 0 22 10' version='1.1' xmlns='http://www.w3.org/2000/svg'>
      <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <path d='M0.5,4.5 L21.5,4.5' className={`line line-${type}`} stroke='#979797' strokeLinecap='square' />
        <circle className={`dot dot-${type}`} stroke='#979797' fill='#D8D8D8' cx='11' cy='5' r='4' />
      </g>
    </svg>
    <div>
      {label}
    </div>
  </div>
)

const BudgetlineTimeline = ({ title, budgetLine, projects }) => {
  console.log(projects)
  const {
    _id,
    fmsNumber,
    description,
    totalAppropriations
  } = budgetLine

  const legendItems = [
    {
      type: 'total',
      label: 'Total'
    },
    {
      type: 'CN',
      label: 'City Funds'
    },
    {
      type: 'CX',
      label: 'City Funds (debt limit exempt)'
    },
    {
      type: 'F',
      label: 'Federal Grants'
    },
    {
      type: 'S',
      label: 'State Funds'
    },
    {
      type: 'P',
      label: 'Private Contributions'
    }
  ]

  return (
    <DefaultLayout title={title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='title-heading'>Budget Line {_id}</div>
            <div className='title-heading'>FMS Number {fmsNumber}</div>
            <h2 className='mb-4'>{toTitleCase(description)}</h2>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='total-container'>
              <h6>Total Appropriations FY08-FY23</h6>
              <div className='big-money'>{formatMoney(totalAppropriations)}</div>
            </div>
          </div>
          <div className='col-6'>
            <div className='total-container'>
              <h6>Capital Projects</h6>
              <div className='big-money'>{(projects && projects.length) || 0}</div>
            </div>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-12 col-md-6'>
            <h4>Available balance FY08-FY23</h4>
          </div>
          <div className='col-12 col-md-6 d-flex justify-content-end'>
            {
              legendItems.map(({ type, label }) => (
                <LegendItem key={type} type={type} label={label} />
              ))
            }
          </div>
          <div className='col-12'>
            <div id='available-balance-chart' />
            <div id='available-balance-tooltip' className='chart-tooltip' />
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-12'>
            <h4>Appropriations FY08-FY23</h4>
            <p>Each year, money is appropriated to budget lines, and may be spread across the current fiscal year or any of the next three fiscal years.  This chart shows each year's appropriations combined with neighboring years</p>
          </div>
          <div className='col-12 d-flex appropriations-legend' />
          <div className='col-12'>
            <div id='appropriations-chart' />
            <div id='appropriations-tooltip' className='chart-tooltip' />
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-12'>
            <h4>Capital Projects</h4>
            <p>Capital Projects associated with this budget line are listed in the Capital Commitment Plan, which is released each fall.  The document outlines planned expenditures over the current and next 3 fiscal years, but does not contain any information about expenditures.</p>
            {
              projects && projects.map((project) => {
                const { id, description, managingAgency } = project
                return (
                  <div key={id} className='card mb-3'>
                    <div className='card-body'>
                      <div className='title-heading'>Project ID: {id}</div>
                      <div className='title-heading'>Managed By: {agencyLookup(managingAgency)}</div>
                      <h3 className='mb-4'>{toTitleCase(description)}</h3>
                      <p>The only public records I'm aware of for expenditures at the capital project level are in <a href='https://www.checkbooknyc.com'>Checkbook NYC</a>.</p>
                      <p><a href={`https://www.checkbooknyc.com/spending/search/transactions/captprj/${managingAgency}${id}`} target='_blank' rel='noopener noreferrer'>Search Checkbook NYC for transactions matching <strong>{managingAgency}{id}</strong></a></p>
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
