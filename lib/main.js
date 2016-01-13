'use babel'

/* global atom */

import {CompositeDisposable} from 'atom'
import {camelCase} from 'change-case'
import PackagesView from './packages-view'
import npm from './npm-adapter'
import {EOL} from 'os'
import path from 'path'

class NpmHelper {
  constructor () {
    this.view = null
    this.subscriptions = null
    this.searching = null
  }

  activate () {
    this.view = new PackagesView(this)
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'npm-helper:search': () => this.search()
      })
    )
  }

  deactivate () {
    this.subscriptions.dispose()
    this.view.destroy()
  }

  search () {
    if (this.searching != null) {
      atom.notifications.addWarning(`Still searching for ${this.searching}`)
      return
    }
    const editor = atom.workspace.getActivePaneItem()
    const selection = editor.getSelectedText()
    if (!selection.length) {
      atom.notifications.addWarning(`Please select some text first`)
      return
    }
    const notification = atom.notifications.addInfo(
      `Searching the npm registry for "${selection}" …`,
      {dismissable: true})
    this.searching = selection
    npm.search(selection)
      .then(results => this.view.setResults(results))
      .catch(err => atom.notifications.addError(err.message, {
        detail: err.stack,
        dismissable: true
      }))
      .then(() => {
        notification.dismiss()
        this.searching = null
      })
  }

  install (pkgName) {
    const notification = atom.notifications.addInfo(
      `Installing package ${pkgName} with npm …`,
      {dismissable: true})
    const editor = atom.workspace.getActivePaneItem()
    npm.install(pkgName, path.dirname(editor.getPath()))
      .then(result => {
        atom.notifications.addSuccess(
          `Package ${pkgName} successfully installed!`)
      })
      .catch(err => atom.notifications.addError(err.message, {
        detail: err.stack,
        dismissable: true
      }))
      .then(() => notification.dismiss())
  }

  onSelect (item) {
    if (!item) {
      return
    }
    const pkgName = item.name
    this.install(pkgName)
    const impName = camelCase(pkgName)
    const editor = atom.workspace.getActivePaneItem()
    editor.insertText(`${EOL}import ${impName} from '${pkgName}'${EOL}`)
  }
}

export default new NpmHelper()
