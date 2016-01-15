'use babel'

import {SelectListView, $$} from 'atom-space-pen-views'

export default class PackagesView extends SelectListView {
  initialize (onSelect) {
    super.initialize()
    this._onSelect = onSelect
    this._insertImport = false
    this.addClass('npm-helper')
  }

  getFilterKey () {
    return 'name'
  }

  viewForItem (item) {
    return $$(function () {
      this.li({'class': 'two-lines'}, () => {
        this.div({'class': 'primary-line'}, () => {
          this.span({'class': 'icon icon-' + (item.dev ? 'code' : 'package')},
            item.name + (item.dev ? ' → dev' : ''))
        })
        this.div({'class': 'secondary-line'}, () => {
          this.span(item.description)
        })
      })
    })
  }

  confirmed (item) {
    this._panel.hide()
    this._onSelect(item, this._insertImport)
  }

  cancelled () {
    this._panel.hide()
    this._onSelect(null, this._insertImport)
  }

  setResults (results, insertImport = false) {
    if (this._panel == null) {
      this._panel = atom.workspace.addModalPanel({item: this})
    }
    this._insertImport = insertImport
    const items = []
    for (const item of results) {
      const devItem = Object.assign({dev: true}, item)
      items.push(item)
      items.push(devItem)
    }
    this._panel.show()
    this.setItems(items)
    this.focusFilterEditor()
  }
}
