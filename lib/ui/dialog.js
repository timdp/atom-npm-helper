'use babel'

// Originally borrowed from project-manager

import { TextEditorView, View } from 'atom-space-pen-views'

export default class Dialog extends View {
  static content ({ prompt } = {}) {
    return this.div({ class: 'npm-helper-dialog' }, () => {
      this.label(prompt, { class: 'icon', outlet: 'promptText' })
      this.subview('miniEditor', new TextEditorView({ mini: true }))
      this.div({ class: 'error-message text-error', outlet: 'errorMessage' })
    })
  }

  initialize ({ input, select, iconClass } = {}) {
    if (iconClass) {
      this.promptText.addClass(iconClass)
    }
    atom.commands.add(this.element, {
      'core:confirm': () => this.onConfirm(this.miniEditor.getText()),
      'core:cancel': () => this.cancel()
    })
    this.miniEditor.on('blur', () => this.close())
    this.miniEditor.getModel().onDidChange(() => this.showError())
    this.miniEditor.getModel().setText(input)
    if (select) {
      const range = [[0, 0], [0, input.length]]
      this.miniEditor.getModel().setSelectedBufferRange(range)
    }
  }

  attach () {
    this.panel = atom.workspace.addModalPanel({ item: this.element })
    this.miniEditor.focus()
    this.miniEditor.getModel().scrollToCursorPosition()
  }

  close () {
    const panelToDestroy = this.panel
    this.panel = null
    if (panelToDestroy != null) {
      panelToDestroy.destroy()
    }
    atom.workspace.getActivePane().activate()
  }

  cancel () {
    this.close()
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      atom.views.getView(editor).focus()
    }
  }

  showError (message = '') {
    this.errorMessage.text(message)
    if (message) {
      this.flashError()
    }
  }
}
