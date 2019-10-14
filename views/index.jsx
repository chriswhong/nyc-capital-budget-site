const React = require('react')
const DefaultLayout = require('./layouts/default')
const slugify = require('slugify')
const {
  formatMoney
} = require('../utils/helpers')

const Index = (props) => {
  const { budgetTypes, fy } = props

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='jumbotron'>
              <h1 className='display-4'>Explore the NYC Capital Budget</h1>
              <p className='lead'>This is a civic tech project that seeks to visualize the New York City Capital Budget</p>
              <p className='lead'>We currently show data from fiscal year 2008 through fiscal year 2020, obtained from <a href="https://www1.nyc.gov/site/omb/publications/publications.page">Office of Management and Budget (OMB) online publications</a>.</p>
              <hr className='my-4' />
              <p>Capital funds are appropriated to budget lines.  All budget lines fall into one of 45 "project types".</p>
              <p>Click on a project type below to explore its associated budget lines and projects.</p>
            </div>
          </div>
        </div>
        <div className='row'>
          {
            budgetTypes.map((budgetType) => {
              const {
                description,
                _id,
                budgetLines,
                totalAppropriations
              } = budgetType
              return (
                <div key={_id} className='col-md-6'>
                  <a className='text-decoration-none' href={`/type/${_id.toLowerCase()}/${slugify(description, { lower: true })}`}>
                    <div className='card mb-4'>
                      <div className='card-body'>
                        <h4 className='card-title'>{description}</h4>
                        <div className='mb-3'>
                          <div className='summary-info'><span className='badge badge-pill badge-secondary'>{budgetLines}</span> budget lines</div>
                        </div>
                        <div className='row'>
                          <div className='col-6'>
                            <div className='total-container'>
                              <h6>FY08-FY23 Appropriations</h6>
                              <div className='big-money'>{formatMoney(totalAppropriations)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

              )
            })
          }
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = Index
