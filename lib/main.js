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

class NpmHelper {
  constructor () {
    this.config = {
      searchType: {
        title: 'Search Type',
        description: 'What method to use for searching the npm registry',
        type: 'string',
        default: 'web',
        enum: ['autocomplete', 'web']
      }
    }
    this.pkgView = null
    this.subscriptions = null
    this.operation = null
  }

  activate () {
    this.pkgView = new PackagesView(this)
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'npm-helper:search': () => this.search(),
        'npm-helper:install': () => this.install()
      })
    )
  }

  deactivate () {
    this.subscriptions.dispose()
    this.pkgView.destroy()
  }

  search () {
    this.fromInput(this.performSearch, 'Enter package name or part of it')
  }

  install () {
    this.fromInput(this.decideDev, 'Enter name of package to install')
  }

  decideDev (name) {
    this.pkgView.setResults([{name}])
  }

  performSearch (text) {
    this.onStart(`Searching the npm registry for "${text}" …`, `searching for "text"`)
    npm.search(text)
      .then(results => {
        if (results.length) {
          this.pkgView.setResults(results)
        } else {
          atom.notifications.addWarning(`No search results for "${text}"`)
        }
      })
      .then(() => this.onDone(), err => this.onError(err))
  }

  performInstall (pkgName, dev) {
    const editor = atom.workspace.getActivePaneItem()
    const filePath = editor.getPath()
    if (filePath == null) {
      atom.notifications.addWarning('Path to file unknown, please save first')
      return
    }
    const suffix = dev ? ' (dev)' : ''
    this.onStart(`Installing package ${pkgName}${suffix} with npm …`,
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
      .then(() => this.onDone(), err => this.onError(err))
  }

  onStart (notif, descr) {
    this.notification = atom.notifications.addInfo(notif, {dismissable: true})
    this.operation = descr
  }

  onError (err) {
    atom.notifications.addError(err.message, {
      detail: err.stack,
      dismissable: true
    })
    this.onDone()
  }

  onDone () {
    this.notification.dismiss()
    this.operation = null
  }

  fromInput (func, prompt) {
    if (this.operation != null) {
      atom.notifications.addWarning(`Still ${this.operation}`)
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
      func.call(this, selection)
    } else {
      const dialog = new InputDialog(prompt)
      dialog.show(text => func.call(this, text))
    }
  }

  onSelectPackage (item) {
    if (item) {
      this.performInstall(item.name, item.dev)
    }
  }
}

export default new NpmHelper()
