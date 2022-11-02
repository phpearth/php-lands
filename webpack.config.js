const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader",
            ]
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'style.css'})
    ],
    externals: {
        openseadragon: 'OpenSeadragon'
    }
};

module.exports = config;
