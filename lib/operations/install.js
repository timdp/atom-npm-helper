'use babel'

import ops from '../operations'
import spawnPromise from '../util/spawn-promise'

const npmInstall = (pkg, dir, dev = false) => {
  const opt = dev ? '--save-dev' : '--save'
  return spawnPromise('npm', ['install', opt, pkg], dir)
}

export default (pkgName, dir, dev) => {
  const suffix = dev ? ' (dev)' : ''
  ops.start(`Installing package ${pkgName}${suffix} with npm …`,
    `installing package ${pkgName}`)
  return npmInstall(pkgName, dir, dev)
    .then(ops.done, ops.error)
}
