const React = require('react')

class DefaultLayout extends React.Component {
  render () {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T' crossOrigin='anonymous' />
          <link rel='stylesheet' href='/css/styles.css' />
        </head>
        <body>
          <nav className='navbar navbar-dark bg-dark'>
            <a className='navbar-brand' href='#'>NYC Capital Budget</a>
            <form className='form-inline my-2 my-lg-0'>
              <input className='form-control mr-sm-2 search' type='search' placeholder='Search' aria-label='Search' />
            </form>
          </nav>
          <div className='search-results' />
          {this.props.children}
          <script
            src='https://code.jquery.com/jquery-3.4.1.min.js'
            integrity='sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo='
            crossOrigin='anonymous'
          />
          <script src='//d3js.org/d3.v5.min.js' />
          <script src='/js/palette.js' />
          <script src='/js/search.js' />
          <script src='/js/chart.js' />
        </body>
      </html>
    )
  }
}

module.exports = DefaultLayout
