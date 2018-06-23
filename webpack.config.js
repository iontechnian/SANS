const path = require('path');

module.exports = {
    entry: {
        salien: './index.js',
        script: './script.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}