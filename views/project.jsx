const React = require('react')
const DefaultLayout = require('./layouts/default')

const {
  agencyLookup,
  formatMoney
} = require('../utils/helpers')

const Project = (props) => {
  const {
    id,
    description,
    managingAgency,
    commitments
  } = props.project

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <p className='project-title-heading mb-1'>Project Id: {id}</p>
            <h4>{description}</h4>
            <p>Managed By: {agencyLookup(managingAgency)}</p>

            <h5>Commitments</h5>
            <div className='commitments-table-container'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Category</th>
                    <th scope='col'>Subcategory</th>
                    <th scope='col'>Total Cost</th>
                    <th scope='col'>City Cost</th>
                    <th scope='col'>Non-city Cost</th>
                    <th scope='col'>Planned Start</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    commitments.map(({
                      code,
                      categoryDescription,
                      subcategoryDescription,
                      cost,
                      planCommDate
                    }) => (
                      <tr key={`${code}${cost}${planCommDate}`}>
                        <td>{categoryDescription}</td>
                        <td>{subcategoryDescription || 'N/A'}</td>
                        <td>{formatMoney(cost.city + cost.nonCity)}</td>
                        <td>{formatMoney(cost.city)}</td>
                        <td>{formatMoney(cost.nonCity)}</td>
                        <td>{planCommDate}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

module.exports = Project
