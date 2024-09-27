module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'sznm/react',
    'plugin:react/jsx-runtime',
    'plugin:@next/next/recommended',
  ],
  rules: {
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    'import/no-extraneous-dependencies': 'off',
    'sonarjs/no-duplicate-string': 'off',
  },
  ignorePatterns: ['next-sitemap.config.js', '.eslintrc.js'],
};
