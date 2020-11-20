const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 3333,
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ]
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
}