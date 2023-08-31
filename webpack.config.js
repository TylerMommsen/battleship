const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js', // Entry point of your application
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js', // Name of the output bundle
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
};
