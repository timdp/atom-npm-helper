# npm-helper

[![apm](https://img.shields.io/apm/v/npm-helper.svg)](https://atom.io/packages/npm-helper) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

Search the npm registry and install packages from Atom.

## Installation

```bash
$ apm install npm-helper
```

## Usage

This extension exposes two keyboard shortcuts.

Hit `alt-shift-n` (`ctrl-cmd-n` on OS X) and enter a query to start searching
the npm registry.

If you already know the exact name of the package to install, use `alt-shift-i`
(`ctrl-cmd-i` on OS X) to install it directly.

For both commands, if text is selected while invoking it, that text will be used
as the input instead.

## Settings

### searchType (default: web)

If set to `web`, searches by scraping npmjs.com's search page. If set to
`autocomplete`, uses npmjs.com's autocomplete feature, which is graciously
offered by [Constructor.io](https://constructor.io/).

## Author

[Tim De Pauw](https://tmdpw.eu/)

## License

MIT
