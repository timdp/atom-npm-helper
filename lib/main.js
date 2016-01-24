'use babel'

import {CompositeDisposable} from 'atom'

let completer
let pkgView
let subscriptions

const getPackagesView = () => {
  if (pkgView == null) {
    const PackagesView = require('./ui/packages-view')
    const installAndImport = require('./util/install-and-import')
    pkgView = new PackagesView((item, insertImport) => {
      if (item) {
        installAndImport(item.name, item.dev, insertImport)
      }
    })
  }
  return pkgView
}

const showSearchResults = (text, results) => {
  if (results.length) {
    getPackagesView().setResults(results, true)
  } else {
    atom.notifications.addWarning(`No search results for "${text}"`)
  }
}

export default class NpmHelper {
  static get config () {
    return require('./config')
  }

  static activate () {
    subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'npm-helper:search': NpmHelper.search,
        'npm-helper:install': NpmHelper.install
      })
    )
  }

  static deactivate () {
    subscriptions.dispose()
    if (pkgView != null) {
      pkgView.destroy()
    }
  }

  static search () {
    const fromInput = require('./util/from-input')
    const performSearch = require('./operations/search')
    fromInput('Enter package name or part of it',
      text => performSearch(text).then(results => showSearchResults(text, results)))
  }

  static install () {
    const fromInput = require('./util/from-input')
    fromInput('Enter name of package to install',
      input => NpmHelper.chooseTypeAndInstall(input, true))
  }

  static chooseTypeAndInstall (name, insertImport = false) {
    getPackagesView().setResults([{name}], insertImport)
  }

  static provideCompleter () {
    if (completer == null) {
      const Completer = require('./completer')
      completer = new Completer()
    }
    return completer
  }
}
