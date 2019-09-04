const React = require('react')
const DefaultLayout = require('./layouts/default')
const slugify = require('slugify')

const {
  agencyLookup,
  formatMoney,
  toTitleCase,
  formatTableValue
} = require('../utils/helpers')

const HelloMessage = (props) => {
  const {
    budgetLineId,
    fmsNumber,
    description,
    availableBalance,
    contractLiability,
    itdExpenditures,
    projects,
    adoptedAppropriations,
    commitmentPlan
  } = props.budgetLine

  const projectList = projects.map((project) => {
    const {
      id,
      managingAgency,
      description,
      commitmentCount,
      totalCommitments
    } = project

    return (
      <a key={id} className='text-decoration-none' href={`/projects/${id.toLowerCase()}/${slugify(description, { lower: true })}`}>
        <div className='card mb-3 capital-project-card'>
          <div className="card-body">
            <p className='project-title-heading mb-1'>Project Id: {id}</p>
            <h4>{description}</h4>
            <p>Managed By: {agencyLookup(managingAgency)}</p>
            <p>Commitments: {commitmentCount}</p>
            <p>Total FY19-FY22: {formatMoney(totalCommitments)}</p>
          </div>
        </div>
      </a>
    )
  })

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='title-heading'>Budget Line {budgetLineId}</div>
            <div className='title-heading'>FMS Number {fmsNumber}</div>
            <h1 className='mb-4'>{toTitleCase(description)}</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-4 mb-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Available Balance</h5>
                <div className="card-text">
                  <h1 className='mb-3'>{formatMoney(availableBalance.city + availableBalance.nonCity)}</h1>
                  <p className='mb-0'>City funds: {formatMoney(availableBalance.city)}</p>
                  <p className='mb-0'>Non-city funds: {formatMoney(availableBalance.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4 mb-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Contract Liability</h5>
                <div className="card-text">
                  <h1 className='mb-3'>{formatMoney(contractLiability.city + contractLiability.nonCity)}</h1>
                  <p className='mb-0'>City funds: {formatMoney(contractLiability.city)}</p>
                  <p className='mb-0'>Non-city funds: {formatMoney(contractLiability.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12 col-md-4 mb-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Itd Expenditures</h5>
                <div className="card-text">
                  <h1 className='mb-3'>{formatMoney(itdExpenditures.city + itdExpenditures.nonCity)}</h1>
                  <p className='mb-0'>City funds: {formatMoney(itdExpenditures.city)}</p>
                  <p className='mb-0'>Non-city funds: {formatMoney(itdExpenditures.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12 col-md-6 mb-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Adopted Appropriations</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">FY19</th>
                      <th scope="col">FY20</th>
                      <th scope="col">FY21</th>
                      <th scope="col">FY22</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>City Cost</td>
                      <td>{formatTableValue(adoptedAppropriations[0].city)}</td>
                      <td>{formatTableValue(adoptedAppropriations[1].city)}</td>
                      <td>{formatTableValue(adoptedAppropriations[2].city)}</td>
                      <td>{formatTableValue(adoptedAppropriations[3].city)}</td>
                    </tr>
                    <tr>
                      <td>Non-city</td>
                      <td>{formatTableValue(adoptedAppropriations[0].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[1].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[2].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[3].nonCity)}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{formatTableValue(adoptedAppropriations[0].city + adoptedAppropriations[0].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[1].city + adoptedAppropriations[1].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[2].city + adoptedAppropriations[2].nonCity)}</td>
                      <td>{formatTableValue(adoptedAppropriations[3].city + adoptedAppropriations[3].nonCity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 mb-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Planned Commitments</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">FY19</th>
                      <th scope="col">FY20</th>
                      <th scope="col">FY21</th>
                      <th scope="col">FY22</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>City Cost</td>
                      <td>{formatTableValue(commitmentPlan[0].city)}</td>
                      <td>{formatTableValue(commitmentPlan[1].city)}</td>
                      <td>{formatTableValue(commitmentPlan[2].city)}</td>
                      <td>{formatTableValue(commitmentPlan[3].city)}</td>
                    </tr>
                    <tr>
                      <td>Non-city</td>
                      <td>{formatTableValue(commitmentPlan[0].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[1].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[2].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[3].nonCity)}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{formatTableValue(commitmentPlan[0].city + commitmentPlan[0].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[1].city + commitmentPlan[1].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[2].city + commitmentPlan[2].nonCity)}</td>
                      <td>{formatTableValue(commitmentPlan[3].city + commitmentPlan[3].nonCity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <h2>Capital Projects</h2>
          {projectList}
        </div>
      </div>

    </DefaultLayout>
  )
}

module.exports = HelloMessage
