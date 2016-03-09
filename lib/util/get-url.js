'use babel'

import got from 'got'

export default (url, options) => {
  return got(url, Object.assign({retries: 0}, options))
    .then(({body}) => body)
}
