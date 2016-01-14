'use babel'

import request from 'request'
import he from 'he'

const reResult = /<li>[\s\S]*?<a class="name"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<p class="description"[^>]*>([\s\S]*?)<\/p>/g

export default query => new Promise((resolve, reject) => {
  const url = 'https://www.npmjs.com/search?q=' + encodeURIComponent(query)
  request(url, (err, resp, body) => {
    if (err) {
      return reject(err)
    }
    if (resp.statusCode !== 200) {
      return reject(new Error('HTTP ${res.statusCode}'))
    }
    const results = []
    let match = null
    while ((match = reResult.exec(body)) !== null) {
      results.push({
        name: he.decode(match[1]),
        description: he.decode(match[2])
      })
    }
    resolve(results)
  })
})
