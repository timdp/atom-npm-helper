'use babel'

import request from 'request'
import promiseTimeout from './promise-timeout'

const httpGet = url => new Promise((resolve, reject) => {
  request(url, (err, resp, body) => {
    if (err) {
      reject(err)
    } else if (resp.statusCode !== 200) {
      reject(new Error(`HTTP ${resp.statusCode}`))
    } else {
      resolve(body)
    }
  })
})

export default (url, {timeout} = {}) => promiseTimeout(httpGet(url), timeout)
