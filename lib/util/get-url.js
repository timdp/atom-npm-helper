'use babel'

import {allowUnsafeEval} from 'loophole'
const got = allowUnsafeEval(() => require('got'))

export default (url, options) => {
  return got(url, Object.assign({retries: 0}, options))
    .then(({body}) => body)
}
