import baseConfig from '../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here.
    // NOTE: .vue files are not linted yet — adding eslint-plugin-vue is a
    // planned follow-up.
    rules: {},
  },
];
