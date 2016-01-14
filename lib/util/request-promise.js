'use babel'

import request from 'request'

export default url => new Promise((resolve, reject) => {
  request(url, (err, resp, body) => {
    if (err) {
      reject(err)
    } else if (resp.statusCode !== 200) {
      reject(new Error('HTTP ${res.statusCode}'))
    } else {
      resolve(body)
    }
  })
})
