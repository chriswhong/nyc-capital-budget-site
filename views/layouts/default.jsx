const React = require('react')

class DefaultLayout extends React.Component {
  render () {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T' crossorigin='anonymous' />
          <link rel='stylesheet' href='/css/styles.css' />
        </head>
        <body>
          <nav className='navbar navbar-dark bg-dark'>
            <a className='navbar-brand' href='#'>NYC Capital Budget</a>
          </nav>
          {this.props.children}
        </body>
      </html>
    )
  }
}

module.exports = DefaultLayout
