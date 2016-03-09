'use babel'

import {camelCase} from 'change-case'
import {Selector} from 'selector-kit'
import performInstall from '../operations/install'
import path from 'path'

const selectors = Selector.create('.source.js')

const matchesAnySelector = (editor) => {
  const cursor = editor.getLastCursor()
  if (!cursor) {
    return false
  }
  const scopeChain = cursor.getScopeDescriptor().getScopeChain()
  return selectors.reduce((m, s) => m || s.matches(scopeChain), false)
}

const insertImportAtCursor = (pkgName, editor) => {
  const impName = camelCase(pkgName)
  const eol = editor.getBuffer().lineEndingForRow(editor.getCursorBufferPosition().row)
  editor.insertText(`import ${impName} from '${pkgName}'${eol}`, {
    select: !editor.getSelectedBufferRange().isEmpty()
  })
}

export default (pkgName, dev, insertImport) => {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor == null || editor.getPath() == null) {
    atom.notifications.addWarning('Path to file unknown, please save first')
    return Promise.resolve()
  }
  atom.views.getView(editor).focus()
  const dir = path.dirname(editor.getPath())
  return performInstall(pkgName, dir, dev)
    .then(() => {
      atom.notifications.addSuccess(`Package ${pkgName} successfully installed!`)
      if (insertImport && matchesAnySelector(editor)) {
        insertImportAtCursor(pkgName, editor)
      }
    })
}
