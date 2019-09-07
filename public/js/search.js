/* global $ */

const getListItem = ({ id, description, url }) => {
  return `
    <a href=${url}
      <li class='list-group-item'>
        <div class='result-id'>${id}</div> ${description}
      </li>
    </a>
  `
}

const noResultsListItem = `
  <li class='list-group-item no-results'>No matches found</li>
`

const renderSearchResults = (results) => {
  const listGroup = $('<div></div>').addClass('list-group')

  listGroup.append('<li class=\'list-group-item section-header\'>Budget Lines</li>')

  const budgetLines = results.filter(d => d.type === 'budgetLine')

  if (budgetLines.length > 0) {
    budgetLines.map((d) => {
      listGroup.append(getListItem(d))
    })
  } else {
    listGroup.append(noResultsListItem)
  }

  listGroup.append('<li class=\'list-group-item section-header\'>Capital Projects</li>')

  const projects = results.filter(d => d.type === 'project')

  if (projects.length > 0) {
    projects.map((d) => {
      listGroup.append(getListItem(d))
    })
  } else {
    listGroup.append(noResultsListItem)
  }

  $('.search-results').html(listGroup)
}

$(document).ready(() => {
  $('.search').on('change keyup', (e) => {
    const q = e.target.value

    if (q.length < 3) {
      $('.search-results').empty()
      return
    }

    $.getJSON(`/search?q=${q}`)
      .then(renderSearchResults)
  })
})
