const React = require('react')
const DefaultLayout = require('./layouts/default')
const slugify = require('slugify')

const {
  formatMoney,
  toTitleCase
} = require('../utils/helpers')

const ProjectType = (props) => {
  const { budgetLines, type, typeDisplay } = props

  const grandTotalAppropriations = budgetLines.reduce((acc, curr) => acc + curr.totalAppropriations, 0)

  console.log(grandTotalAppropriations)

  return (
    <DefaultLayout title={props.title}>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='title-heading'>Capital Project Type</div>
            <h1>{typeDisplay} ({type.toUpperCase()})</h1>
            <p>From fy 2008 - fy 2022, {typeDisplay} consisted of {budgetLines.length} budget lines.  This type received {formatMoney(grandTotalAppropriations)} in new appropriations.</p>
          </div>
          <div className='col-12'>
            {
              budgetLines.map((budgetLine) => {
                const { _id, fmsNumber, description, lowFy, highFy, projects, totalAppropriations } = budgetLine
                return (
                  <a key={_id} href={`/type/${type}/budgetline/${_id.toLowerCase()}/${slugify(description, { lower: true })}`}>
                    <div key={_id} className='card mb-3'>
                      <div className='card-body'>
                        <div className='title-heading'>Budget Line {_id}</div>
                        <div className='title-heading'>FMS Number {fmsNumber}</div>
                        <h3 className='mb-4'>{toTitleCase(description)}</h3>
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
                              <div className='big-money'>{projects}</div>
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
