const React = require('react')
const DefaultLayout = require('./layouts/default')
const numeral = require('numeral')

const money = (amount) => numeral(amount).format('$0,0.00')

const HelloMessage = (props) => {
  const {
    budgetLineId,
    fmsNumber,
    description,
    availableBalance,
    contractLiability,
    itdExpenditures,
    projects
  } = props.budgetLine

  const projectList = projects.map((project) => {
    const {
      id,
      managingAgency,
      description
    } = project

    return (
      <div key='id'>
        <h5>{description}</h5>
        <p>Project id: {id}</p>
        <p>Managed By: {managingAgency}</p>

      </div>
    )
  })

  return (
    <DefaultLayout title={props.title}>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h3>{description}</h3>
            <h5>Budget Line {budgetLineId}</h5>
            <h5>FMS Number {fmsNumber}</h5>
          </div>
          <div className='col-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Available Balance</h5>
                <div className="card-text">
                  <h3 className='mb-3'>{money(availableBalance.city + availableBalance.nonCity)}</h3>
                  <p className='mb-0'>City funds: {money(availableBalance.city)}</p>
                  <p>Non-city funds: {money(availableBalance.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Contract Liability</h5>
                <div className="card-text">
                  <h3 className='mb-3'>{money(contractLiability.city + contractLiability.nonCity)}</h3>
                  <p className='mb-0'>City funds: {money(contractLiability.city)}</p>
                  <p>Non-city funds: {money(contractLiability.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='card'>
              <div className="card-body">
                <h5 className="card-title">Itd Expenditures</h5>
                <div className="card-text">
                  <h3 className='mb-3'>{money(itdExpenditures.city + itdExpenditures.nonCity)}</h3>
                  <p className='mb-0'>City funds: {money(itdExpenditures.city)}</p>
                  <p>Non-city funds: {money(itdExpenditures.nonCity)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12'>
            <h3>Projects</h3>
            {projectList}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = HelloMessage
