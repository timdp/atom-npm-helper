'use babel'

/* global atom */

import spawnPromise from './spawn-promise'
import autocompleteSearch from './search/autocomplete'
import webSearch from './search/web'

const searchers = {
  autocomplete: autocompleteSearch,
  web: webSearch
}

export default {
  search: query => {
    const searchType = atom.config.get('npm-helper.searchType') || 'autocomplete'
    return searchers[searchType](query)
  },

  install: (pkg, dir, dev = false) => {
    const opt = dev ? '--save-dev' : '--save'
    return spawnPromise('npm', ['install', opt, pkg], dir)
  }
}
