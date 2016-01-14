'use babel'

/* global atom */

import {SelectListView, $$} from 'atom-space-pen-views'

export default class PackagesView extends SelectListView {
  initialize (main) {
    super.initialize()
    this.main = main
    this.addClass('npm-helper')
  }

  getFilterKey () {
    return 'name'
  }

  viewForItem (item) {
    return $$(function () {
      this.li({'class': 'two-lines'}, () => {
        this.div({'class': 'primary-line'}, () => {
          this.span(item.name)
        })
        this.div({'class': 'secondary-line'}, () => {
          this.span(item.description)
        })
      })
    })
  }

  confirmed (item) {
    this.panel.hide()
    this.main.onSelectPackage(item)
  }

  cancelled () {
    this.panel.hide()
    this.main.onSelectPackage(null)
  }

  setResults (results) {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this})
    }
    this.panel.show()
    this.setItems(results)
    this.focusFilterEditor()
  }
}
