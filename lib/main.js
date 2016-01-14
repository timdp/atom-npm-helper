'use babel'

/* global atom */

import {CompositeDisposable} from 'atom'
import {camelCase} from 'change-case'
import PackagesView from './packages-view'
import InputDialog from './input-dialog'
import npm from './npm-adapter'
import {EOL} from 'os'
import path from 'path'

const reJsScope = /^source\.js($|\.)/

let pkgView
let subscriptions
let notification
let operation

const onStart = (notif, descr) => {
  notification = atom.notifications.addInfo(notif, {dismissable: true})
  operation = descr
}

const onError = err => {
  atom.notifications.addError(err.message, {
    detail: err.stack,
    dismissable: true
  })
  onDone()
}

const onDone = () => {
  notification.dismiss()
  operation = null
}

const fromInput = (func, prompt) => {
  if (operation != null) {
    atom.notifications.addWarning(`Still ${operation}`)
    return
  }
  const editor = atom.workspace.getActivePaneItem()
  const filePath = editor.getPath()
  if (filePath == null) {
    atom.notifications.addWarning('Path to file unknown, please save first')
    return
  }
  const selection = editor.getSelectedText().trim()
  if (selection.length > 0) {
    func(selection)
  } else {
    const dialog = new InputDialog(prompt)
    dialog.show(func)
  }
}

const decideDev = name => {
  pkgView.setResults([{name}])
}

const performSearch = text => {
  onStart(`Searching the npm registry for "${text}" …`, `searching for "text"`)
  npm.search(text)
    .then(results => {
      if (results.length) {
        pkgView.setResults(results)
      } else {
        atom.notifications.addWarning(`No search results for "${text}"`)
      }
    })
    .then(onDone, onError)
}

const performInstall = (pkgName, dev) => {
  const editor = atom.workspace.getActivePaneItem()
  const filePath = editor.getPath()
  if (filePath == null) {
    atom.notifications.addWarning('Path to file unknown, please save first')
    return
  }
  const suffix = dev ? ' (dev)' : ''
  onStart(`Installing package ${pkgName}${suffix} with npm …`,
    `installing package ${pkgName}`)
  npm.install(pkgName, path.dirname(filePath), dev)
    .then(result => {
      atom.notifications.addSuccess(`Package ${pkgName} successfully installed!`)
      const grammar = editor.getGrammar()
      if (reJsScope.test(grammar.scopeName)) {
        const impName = camelCase(pkgName)
        editor.insertText(`import ${impName} from '${pkgName}'${EOL}`, {
          select: !editor.getSelectedBufferRange().isEmpty()
        })
      }
    })
    .then(onDone, onError)
}

const onSelectPackage = item => {
  if (item) {
    performInstall(item.name, item.dev)
  }
}

const NpmHelper = {
  config: {
    searchType: {
      title: 'Search Type',
      description: 'What method to use for searching the npm registry',
      type: 'string',
      default: 'web',
      enum: ['autocomplete', 'web']
    }
  },

  activate () {
    pkgView = new PackagesView(onSelectPackage)
    subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'npm-helper:search': NpmHelper.search,
        'npm-helper:install': NpmHelper.install
      })
    )
  },

  deactivate () {
    subscriptions.dispose()
    pkgView.destroy()
  },

  search () {
    fromInput(performSearch, 'Enter package name or part of it')
  },

  install () {
    fromInput(decideDev, 'Enter name of package to install')
  }
}

export default NpmHelper
