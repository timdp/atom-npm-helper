'use babel'

import getUrl from '../util/get-url'

const CONSTRUCTOR_IO_KEY = 'rsPfVUdLBI6eqE7FrXbH'

export default query => {
  const host = 'ac.cnstrc.com'
  const path = '/autocomplete/' + encodeURIComponent(query)
  const now = Date.now()
  const url = `https://${host}${path}?autocomplete_key=${CONSTRUCTOR_IO_KEY}&_=${now}`
  return getUrl(url, {timeout: atom.config.get('npm-helper.searchTimeout')})
    .then(body => {
      const pkg = JSON.parse(body).sections.packages
      return pkg.map(({data, value: name}) => {
        const description = data ? data.description : ''
        return {name, description}
      })
    })
}
