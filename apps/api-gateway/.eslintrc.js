const rootConfig = require('../../.eslintrc.js');

module.exports = {
  ...rootConfig,
  parserOptions: {
    ...rootConfig.parserOptions,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
