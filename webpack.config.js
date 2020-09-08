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
        filename: "bundle.js",
        path: path.resolve(__dirname, 'bin')
    },
    mode: "production",

}