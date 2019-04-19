module.exports = {
  extends: [
    // 'plugin:shopify/eslint-comments',
    'plugin:shopify/esnext',
    // 'plugin:shopify/node',
    'plugin:shopify/webpack',
    'plugin:shopify/prettier',
  ],
  globals: {},
  rules: {
    'no-console': 0,
    'no-warning-comments': 0,
    'eslint-comments/no-unlimited-disable': 0,
  },
  env: {
    browser: true,
  },
};
