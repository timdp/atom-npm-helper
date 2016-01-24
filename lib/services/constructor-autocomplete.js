'use babel'

import getUrl from '../util/get-url'

const CONSTRUCTOR_IO_KEY = 'rsPfVUdLBI6eqE7FrXbH'

export default query => {
  const host = 'ac.cnstrc.com'
  const path = '/autocomplete/' + encodeURIComponent(query.replace(/\//g, '|'))
  const now = Date.now()
  const url = `https://${host}${path}?autocomplete_key=${CONSTRUCTOR_IO_KEY}&_=${now}`
  const timeout = atom.config.get('npm-helper.searchTimeout')
  return getUrl(url, {timeout, json: true})
    .then(({sections: {packages}}) => packages.map(({data, value: name}) => {
      const description = data ? data.description : ''
      return {name, description}
    }))
}
