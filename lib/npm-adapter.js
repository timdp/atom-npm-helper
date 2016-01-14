'use babel'

import spawnPromise from './spawn-promise'
import request from 'request'

const CONSTRUCTOR_IO_KEY = 'rsPfVUdLBI6eqE7FrXbH'

export default {
  search: query => new Promise((resolve, reject) => {
    const host = 'ac.cnstrc.com'
    const path = '/autocomplete/' + encodeURIComponent(query)
    const now = Date.now()
    const url = `https://${host}${path}?autocomplete_key=${CONSTRUCTOR_IO_KEY}&_=${now}`
    request(url, (err, resp, body) => {
      if (err) {
        return reject(err)
      }
      if (resp.statusCode !== 200) {
        return reject(new Error('HTTP ${res.statusCode}'))
      }
      try {
        const pkg = JSON.parse(resp.body).sections.packages
        resolve(pkg.map(({data, value: name}) => {
          const description = data ? data.description : ''
          return {name, description}
        }))
      } catch (err) {
        return reject(err)
      }
    })
  }),

  install: (pkg, dir, dev = false) => {
    const opt = dev ? '--save-dev' : '--save'
    return spawnPromise('npm', ['install', opt, pkg], dir)
  }
}
