// webpack.config.js
const webpack = require('webpack');

module.exports = {
    // Các cấu hình khác...
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
