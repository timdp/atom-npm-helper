'use babel'

/* global atom */

import {CompositeDisposable} from 'atom'
import {camelCase} from 'change-case'
import PackagesView from './packages-view'
import InputDialog from './input-dialog'
import npm from './npm-adapter'
import {EOL} from 'os'
import path from 'path'

class NpmHelper {
  constructor () {
    this.pkgView = null
    this.inputDialog = null
    this.subscriptions = null
    this.searching = null
  }

  activate () {
    this.pkgView = new PackagesView(this)
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'npm-helper:search': () => this.search()
      })
    )
  }

  deactivate () {
    this.subscriptions.dispose()
    this.pkgView.destroy()
  }

  search () {
    if (this.searching != null) {
      atom.notifications.addWarning(`Still searching for ${this.searching}`)
      return
    }
    const editor = atom.workspace.getActivePaneItem()
    const selection = editor.getSelectedText()
    if (selection.length) {
      this.performSearch(selection)
    } else {
      this.inputDialog = new InputDialog(this)
      this.inputDialog.attach()
    }
  }

  performSearch (text) {
    const notification = atom.notifications.addInfo(
      `Searching the npm registry for "${text}" …`,
      {dismissable: true})
    this.searching = text
    npm.search(text)
      .then(results => this.pkgView.setResults(results))
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

  onSelectPackage (item) {
    if (!item) {
      return
    }
    const pkgName = item.name
    this.install(pkgName)
    const impName = camelCase(pkgName)
    const editor = atom.workspace.getActivePaneItem()
    editor.insertText(`${EOL}import ${impName} from '${pkgName}'${EOL}`)
  }

  onEnterQuery (text) {
    this.performSearch(text)
  }
}

export default new NpmHelper()
