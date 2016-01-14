'use babel'

import Dialog from './util/dialog'

export default class InputDialog extends Dialog {
  constructor (prompt) {
    super({prompt, input: ''})
  }

  show (onResult) {
    this.onResult = onResult
    this.attach()
  }

  onConfirm (text) {
    this.close()
    text = text.trim()
    if (text.length) {
      this.onResult(text)
    }
    this.onResult = null
  }
}
