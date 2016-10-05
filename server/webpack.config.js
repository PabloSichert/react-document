import { readFileSync } from 'fs';

const babel = JSON.parse(readFileSync('./.babelrc', 'utf8'));
const presets = babel.presets || [];

export default {
    entry: './client',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ...presets,
                        'es2015'
                    ],
                    plugins: babel.plugins
                }
            }
        ],
    },
    output: {
        path: './build',
        filename: '[hash].js'
    }
};
