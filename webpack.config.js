const path = require('path')
module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader', options: {
                        configFile: "tsconfig.prod.json"
                    }
                }],
                exclude: '/node_modules/',
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    externals: {
        react: "react",
        reactDom: "react-dom"
    },
    output: {
        filename: "data-paging-manager.js",
        path: path.resolve(__dirname, 'bin'),
        library: "data-paging-manager",
        libraryTarget: "umd"
    },
    mode: "production",

}