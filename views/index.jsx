const React = require('react')
const DefaultLayout = require('./layouts/default')
const slugify = require('slugify')
const {
  formatMoney
} = require('../utils/helpers')

const HelloMessage = (props) => {
  const { budgetTypes } = props

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className="jumbotron">
              <h1 className="display-4">Explore the NYC Capital Commitment Plan</h1>
              <p className="lead">This is a civic tech project that seeks to demystify the New York City Capital Budget.  The Capital Commitment plan is a PDF document that outlines the how the city plans to spend capital money over the next 4 years.</p>
              <p className="lead">All data are from the <a href='https://www1.nyc.gov/site/omb/publications/fy19-accp.page'>FY 2019 Adopted Capital Commitment Plan</a></p>
              <hr className="my-4" />
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
                projects,
                totalAppropriations,
                totalCommitments
              } = budgetType
              return (
                <div key={_id} className='col-md-6'>
                  <a className='text-decoration-none' href={`/types/${_id.toLowerCase()}/${slugify(description, { lower: true })}`}>
                    <div className='card mb-4'>
                      <div className='card-body'>
                        <h4 className="card-title">{description}</h4>
                        <div className='mb-3'>
                          <div className='summary-info'><span className="badge badge-pill badge-secondary">{budgetLines}</span> budget lines</div>
                          <div className='summary-info'><span className="badge badge-pill badge-secondary">{projects}</span> projects</div>
                        </div>
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
                </div>

              )
            })
          }
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = HelloMessage
