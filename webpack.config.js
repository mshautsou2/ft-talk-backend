const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
    mode: "production",
    target: "node",
    entry: {
        app: ["./src/index.ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src/"),
            '@shared': path.resolve(__dirname, "ft-talk-shared/src/"),
        },
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "main.js"
    },
    externals: [nodeExternals()]
}