'use babel'

import ops from '../operations'
import { exec } from 'sb-exec'

const npmInstall = (pkg, dir, dev = false) => {
  const opt = dev ? '--save-dev' : '--save'
  return exec('npm', ['install', opt, pkg], {
    cwd: dir,
    throwOnStdErr: false
  })
}

export default (pkgName, dir, dev) => {
  const suffix = dev ? ' (dev)' : ''
  ops.start(`Installing package ${pkgName}${suffix} with npm …`,
    `installing package ${pkgName}`)
  return npmInstall(pkgName, dir, dev)
    .then(ops.done, ops.error)
}
