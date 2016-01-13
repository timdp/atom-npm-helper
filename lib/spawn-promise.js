'use babel'

import spawn from 'cross-spawn-async'

export default (cmd, args, cwd = null) => new Promise((resolve, reject) => {
  const proc = spawn(cmd, args, {cwd})
  let stdout = ''
  proc.stdout.on('data', data => stdout += data)
  proc.stderr.on('data', data => console.warn(data))
  proc.on('close', code => {
    if (code !== 0) {
      reject(new Error('Exit status ' + code))
    } else {
      resolve(stdout)
    }
  })
})
