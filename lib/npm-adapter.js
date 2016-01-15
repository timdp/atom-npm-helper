'use babel'

import spawnPromise from './util/spawn-promise'
import searchNpm from './services/npm-search'

export default {
  search: query => {
    return searchNpm(query)
  },

  install: (pkg, dir, dev = false) => {
    const opt = dev ? '--save-dev' : '--save'
    return spawnPromise('npm', ['install', opt, pkg], dir)
  }
}
