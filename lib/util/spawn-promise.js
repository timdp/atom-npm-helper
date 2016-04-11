'use babel'

import getPath from 'consistent-path'
import {BufferedProcess} from 'atom'

export default (command, args, cwd = null) => new Promise((resolve, reject) => {
  let stdout, stderr
  const onStdout = (_stdout) => { stdout = _stdout }
  const onStderr = (_stderr) => { stderr = _stderr }
  const onExit = (code) => {
    if (code !== 0) {
      const err = new Error(`${command} exited with ${code}`)
      err.detail = stderr
      reject(err)
    } else {
      resolve({stdout, stderr})
    }
  }
  const env = Object.assign({}, {path: getPath()}, process.env)
  const options = {cwd, env}
  /* eslint no-new: 0 */
  new BufferedProcess({
    command,
    args,
    options,
    stdout: onStdout,
    stderr: onStderr,
    exit: onExit
  })
})
