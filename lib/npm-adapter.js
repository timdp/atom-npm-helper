'use babel'

import spawnPromise from './spawn-promise'

const reWord = /(\w+)/g

class LineParser {
  constructor (header) {
    this.cols = []
    this.indices = []
    let match = null
    while ((match = reWord.exec(header)) !== null) {
      this.cols.push(match[1].toLowerCase())
      this.indices.push(match.index)
    }
  }

  parse (line) {
    const result = {}
    const last = this.indices.length - 1
    for (let i = 0; i < last; ++i) {
      result[this.cols[i]] = line.substring(this.indices[i], this.indices[i + 1]).trim()
    }
    result[this.cols[last]] = line.substring(this.indices[last]).trim()
    return result
  }
}

const parseLines = stdout => {
  const lines = stdout.split(/\r?\n/).filter(line => line.length)
  const parser = new LineParser(lines.shift())
  return lines.map(line => parser.parse(line))
}

export default {
  search: query => {
    return spawnPromise('npm', ['search', query]).then(parseLines)
  },
  install: (pkg, dir, dev = false) => {
    const opt = dev ? '--save-dev' : '--save'
    return spawnPromise('npm', ['install', opt, pkg], dir)
  }
}
