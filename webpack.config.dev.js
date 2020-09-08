const path = require('path')
module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'bin')
    },
    devServer: {
        contentBase:path.join(__dirname,'public'),
        compress:true,
        port:9000,
        hot:true,
        publicPath:"/bin"
    },
    watch: true,
    mode: "development",
    devtool: 'inline-source-map'
}