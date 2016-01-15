# npm-helper

[![apm](https://img.shields.io/apm/v/npm-helper.svg)](https://atom.io/packages/npm-helper) [![Downloads](https://img.shields.io/apm/dm/npm-helper.svg)](https://atom.io/packages/npm-helper) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

Search the npm registry and install packages from Atom. No more cycling between
browsers, terminals and editors!

## Installation

```bash
$ apm install npm-helper
```

## Usage

There are three ways to use this extension:

### Type-Ahead

In a JavaScript file, start typing `import '` followed by the first few
characters of the name of the package you'd like to install and wait for
autocomplete to kick in. Select the package and you're done!

### Install-and-Import

If you know the exact name of the package you'd like to install, hit
`alt-shift-i` (`ctrl-cmd-i` on OS X) and enter it. An `import` statement will
be generated for you.

Alternatively, you can type the name of the package into the editor, select it,
and then use the keyboard shortcut to install it.

### Search-and-Import

To search the npm registry, press `alt-shift-n` (`ctrl-cmd-n` on OS X) and enter
a query. Select a package from the list of search results to install it and
generate an `import` statement.

Alternatively, you can type your search query into the editor, select it, and
then use the keyboard shortcut to start searching immediately.

## Settings

### enableAutocomplete

Autocompletes your import statements and installs packages.

### autocompleteTimeout

How long to wait for autocompletion requests (in milliseconds).

### searchTimeout

How long to wait for search requests (in milliseconds).

## Acknowledgment

The autocomplete feature is powered by [Constructor.io](https://constructor.io/),
who have graciously offered free use of their service.

## Author

[Tim De Pauw](https://tmdpw.eu/)

## License

MIT
