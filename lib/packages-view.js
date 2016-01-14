'use babel'

/* global atom */

import {SelectListView, $$} from 'atom-space-pen-views'

export default class PackagesView extends SelectListView {
  initialize (onSelect) {
    super.initialize()
    this.onSelect = onSelect
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
    this.panel.hide()
    this.onSelect(item)
  }

  cancelled () {
    this.panel.hide()
    this.onSelect(null)
  }

  setResults (results) {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this})
    }
    const items = []
    for (const item of results) {
      const devItem = Object.assign({dev: true}, item)
      items.push(item)
      items.push(devItem)
    }
    this.panel.show()
    this.setItems(items)
    this.focusFilterEditor()
  }
}
