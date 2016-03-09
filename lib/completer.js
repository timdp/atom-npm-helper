'use babel'

import NpmHelper from './main'
import complete from './services/constructor-autocomplete'

const rePkgName = /.*(['"])(.+?)(\1|$)/

export default class Completer {
  get selector () {
    return '.source.js .import .string'
  }

  getSuggestions ({editor, bufferPosition, scopeDescriptor, prefix, activatedManually}) {
    if (!atom.config.get('npm-helper.enableAutocomplete')) {
      return Promise.resolve([])
    }
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
    const match = rePkgName.exec(line)
    if (match === null) {
      return Promise.resolve([])
    }
    return complete(match[2])
      .then((results) => results.map(({name, description}) => ({
        text: name,
        type: 'import',
        description
      })))
      .catch((err) => {
        console.error(err.stack)
        return []
      })
  }

  onDidInsertSuggestion ({editor, triggerPosition, suggestion}) {
    NpmHelper.chooseTypeAndInstall(suggestion.text)
  }
}
