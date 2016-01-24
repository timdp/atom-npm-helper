'use babel'

import {getPath} from 'consistent-path'
import {BufferedProcess} from 'atom'

export default (command, args, cwd = null) => new Promise((resolve, reject) => {
  let output = null
  const stdout = _output => output = _output
  const exit = code => {
    if (code !== 0) {
      reject(new Error('Exit status ' + code))
    } else {
      resolve(output)
    }
  }
  const env = Object.assign({}, {path: getPath()}, process.env)
  const options = {cwd, env}
  /* eslint no-new: 0 */
  new BufferedProcess({command, args, options, stdout, exit})
})
