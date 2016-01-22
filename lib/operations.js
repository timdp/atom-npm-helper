'use babel'

let notification
let operation

export default class Operations {
  static get current () {
    return operation
  }

  static start (notif, descr) {
    notification = atom.notifications.addInfo(notif, {dismissable: true})
    operation = descr
  }

  static done (result) {
    notification.dismiss()
    operation = null
    return result
  }

  static error (err) {
    atom.notifications.addError(err.message, {
      detail: err.stack,
      dismissable: true
    })
    this.done()
    throw err
  }
}
