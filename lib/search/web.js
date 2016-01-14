'use babel'

import he from 'he'
import request from '../util/request-promise'

const reResult = /<li>[\s\S]*?<a class="name"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<p class="description"[^>]*>([\s\S]*?)<\/p>/g

export default query => {
  const url = 'https://www.npmjs.com/search?q=' + encodeURIComponent(query)
  return request(url)
    .then(body => {
      const results = []
      let match = null
      while ((match = reResult.exec(body)) !== null) {
        results.push({
          name: he.decode(match[1]),
          description: he.decode(match[2])
        })
      }
      return results
    })
}
