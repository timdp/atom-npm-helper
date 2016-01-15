'use babel'

import {CompositeDisposable} from 'atom'
import {camelCase} from 'change-case'
import Completer from './completer'
import PackagesView from './packages-view'
import InputDialog from './input-dialog'
import npm from './npm-adapter'
import {EOL} from 'os'
import path from 'path'

const reJsScope = /^source\.js($|\.)/

let completer
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

const performInstall = (pkgName, dev, insertImport) => {
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
      if (insertImport && reJsScope.test(grammar.scopeName)) {
        const impName = camelCase(pkgName)
        editor.insertText(`import ${impName} from '${pkgName}'${EOL}`, {
          select: !editor.getSelectedBufferRange().isEmpty()
        })
      }
    })
    .then(onDone, onError)
}

const onSelectPackage = (item, insertImport) => {
  if (item) {
    performInstall(item.name, item.dev, insertImport)
  }
}

const NpmHelper = {
  config: {
    enableAutocomplete: {
      title: 'Enable Autocomplete',
      description: 'Autocompletes your import statements and installs packages',
      type: 'boolean',
      default: true
    },
    autocompleteTimeout: {
      title: 'Autocomplete Timeout',
      description: 'How long to wait for autocompletion requests (in milliseconds)',
      type: 'number',
      default: 500
    },
    searchTimeout: {
      title: 'Search Timeout',
      description: 'How long to wait for search requests (in milliseconds)',
      type: 'number',
      default: 3000
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
    fromInput(input => NpmHelper.chooseTypeAndInstall(input, true),
      'Enter name of package to install')
  },

  chooseTypeAndInstall (name, insertImport = false) {
    pkgView.setResults([{name}], insertImport)
  },

  provideCompleter () {
    if (completer == null) {
      completer = new Completer()
    }
    return completer
  }
}

export default NpmHelper
