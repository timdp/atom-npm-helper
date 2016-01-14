'use babel'

import Dialog from './dialog'

export default class InputDialog extends Dialog {
  constructor (main) {
    super({prompt: 'Enter module name or part of it', input: ''})
    this.main = main
  }

  onConfirm (text) {
    this.close()
    this.main.onEnterQuery(text)
  }
}
