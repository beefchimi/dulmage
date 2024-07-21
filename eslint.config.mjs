import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Astro likely already configured our `ignores`.
  // { ignores: ['coverage/**', 'dev-dist/**', 'dist/**'], },

  // Extend configs here:
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],

  {
    name: 'custom-rules',

    // Specifying `files` appears to break our TypeScript.
    // files: ['**/*.astro', '**/*.ts', '**/*.js', '**/*.mjs'],

    rules: {
      // Override / add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
