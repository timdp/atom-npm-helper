'use babel'

import ops from '../operations'
import npmSearch from '../services/npm-search'

export default text => {
  ops.start(`Searching the npm registry for "${text}" …`, `searching for "text"`)
  return npmSearch(text)
    .then(ops.done, ops.error)
}
