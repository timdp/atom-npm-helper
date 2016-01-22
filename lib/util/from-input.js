'use babel'

import InputDialog from '../ui/input-dialog'
import ops from '../operations'

export default (prompt, func) => {
  const operation = ops.current
  if (operation != null) {
    atom.notifications.addWarning(`Still ${operation}`)
    return
  }
  const editor = atom.workspace.getActiveTextEditor()
  if (editor == null || editor.getPath() == null) {
    atom.notifications.addWarning('Path to file unknown, please save first')
    return
  }
  const selection = editor.getSelectedText().trim()
  if (selection.length > 0) {
    func(selection)
  } else {
    const dialog = new InputDialog(prompt)
    dialog.show(func)
  }
}
