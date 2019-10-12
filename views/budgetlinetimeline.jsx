const React = require('react')
const DefaultLayout = require('./layouts/default')

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

const BudgetlineTimeline = ({ title, budgetLine }) => {
  console.log(budgetLine)
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
              <h6>Total Appropriations</h6>
              <div className='big-money'>{formatMoney(totalAppropriations)}</div>
            </div>
          </div>
          {
            /* <div className='col-6'>
            <div className='total-container'>
              <h6>Capital Projects</h6>
              <div className='big-money'>{projects.length}</div>
            </div>
          </div> */
          }
        </div>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <h4>Available balance FY08-FY22</h4>
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
            <div id='tooltip' />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            {
              // projects.map((project) => {
              //   console.log(project)
              //   const { id, description, managingAgency } = project
              //   return (
              //     <div key={id} className='card mb-3'>
              //       <div className='card-body'>
              //         <div className='title-heading'>Project ID: {id}</div>
              //         <div className='title-heading'>Managed By: {agencyLookup(managingAgency)}</div>
              //         <h3 className='mb-4'>{toTitleCase(description)}</h3>
              //       </div>
              //     </div>
              //   )
              // })
            }
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = BudgetlineTimeline
