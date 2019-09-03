const React = require('react')

class DefaultLayout extends React.Component {
  render () {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
          <link rel="stylesheet" href="/css/styles.css" />
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    )
  }
}

module.exports = DefaultLayout
