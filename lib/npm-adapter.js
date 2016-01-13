'use babel'

import spawnPromise from './spawn-promise'
import request from 'request'

export default {
  search: query => new Promise((resolve, reject) => {
    const host = 'ac.cnstrc.com'
    const path = '/autocomplete/' + encodeURI(query)
    const key = 'CD06z4gVeqSXRiDL2ZNK'
    const rnd = Date.now()
    const url = `https://${host}${path}?autocomplete_key=${key}&_=${rnd}`
    request(url, (err, resp, body) => {
      if (err) {
        return reject(err)
      }
      if (resp.statusCode !== 200) {
        return reject(new Error('HTTP ${res.statusCode}'))
      }
      try {
        const pkg = JSON.parse(resp.body).sections.packages
        resolve(pkg.map(({data: {description}, value: name}) => {
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
