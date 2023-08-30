const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point of your application
    output: {
        filename: 'bundle.js', // Name of the output bundle
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
};
