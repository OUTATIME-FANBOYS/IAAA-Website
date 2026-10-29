import studio from '@sanity/eslint-config-studio'

export default [
  ...studio,
  {
    // One-off Node scripts that seed content (not part of the Studio bundle)
    files: ['seed/**/*.mjs'],
    languageOptions: {globals: {console: 'readonly', process: 'readonly', URL: 'readonly'}},
  },
]
