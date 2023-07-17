const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        main: path.resolve(__dirname, "..", "src", "main.ts"),
        popup: path.resolve(__dirname, "..", "src", "popup.ts")
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: "/node_modules/"
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: ".",
                    to: ".",
                    context: "public"
                }
            ]
        }),
        new ZipPlugin({
            path: "../release",
            filename: "pop-filter.zip",
        })
    ],
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 200
    },
}