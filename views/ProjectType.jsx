const React = require('react')
const DefaultLayout = require('./layouts/default')
const slugify = require('slugify')

const {
  formatMoney,
  toTitleCase
} = require('../utils/helpers')

const ProjectType = (props) => {
  const { budgetLines, fy, type, typeDisplay } = props
  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <h2>Budget Lines for type {typeDisplay}</h2>
          </div>
          <div className='col-12'>
            {
              budgetLines.map((budgetLine) => {
                const { budgetLineId, fmsNumber, description, totalAppropriations, totalCommitments } = budgetLine
                return (
                  <a key={budgetLineId} href={`/${fy}/type/${type}/budgetline/${budgetLineId.toLowerCase()}/${slugify(description, { lower: true })}`}>
                    <div key={budgetLineId} className='card mb-3'>
                      <div className='card-body'>
                        <div className='title-heading'>Budget Line {budgetLineId}</div>
                        <div className='title-heading'>FMS Number {fmsNumber}</div>
                        <h3 className='mb-4'>{toTitleCase(description)}</h3>
                        <div className='row'>
                          <div className='col-6'>
                            <div className='total-container'>
                              <h6>FY19-FY22 Appropriations</h6>
                              <div className='big-money'>{formatMoney(totalAppropriations)}</div>
                            </div>
                          </div>
                          <div className='col-6'>
                            <div className='total-container'>
                              <h6>FY19-FY22 Commitments</h6>
                              <div className='big-money'>{formatMoney(totalCommitments)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              })
            }
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = ProjectType
