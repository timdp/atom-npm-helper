'use babel'

export default {
  enableAutocomplete: {
    title: 'Enable Autocomplete',
    description: 'Autocompletes your import statements and installs packages',
    type: 'boolean',
    default: true,
    order: 1
  },
  autocompleteTimeout: {
    title: 'Autocomplete Timeout',
    description: 'How long to wait for autocompletion requests (in milliseconds)',
    type: 'number',
    default: 500,
    order: 2
  },
  searchTimeout: {
    title: 'Search Timeout',
    description: 'How long to wait for search requests (in milliseconds)',
    type: 'number',
    default: 3000,
    order: 3
  }
}
