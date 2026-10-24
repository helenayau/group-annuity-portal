// Carbon token linting for the group annuity portal: colors, spacing, type
// and motion must come from Carbon tokens. Scoped to the portal, the only
// part of the repo built on Carbon.
export default {
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-plugin-carbon-tokens'],
  extends: ['stylelint-plugin-carbon-tokens/config/recommended.js']
};
