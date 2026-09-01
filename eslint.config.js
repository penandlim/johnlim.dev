
const babelParser = require('@babel/eslint-parser');
module.exports = [
    {
        files: ['src/**/*.js', 'src/**/*.jsx', 'webpack.config.js'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            globals: {
                grained: 'readonly'
            }
        },
        rules: {
            'no-constant-condition': 'error',
            'no-unreachable': 'error'
        }
    }
];
