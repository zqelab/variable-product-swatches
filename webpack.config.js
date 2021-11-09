const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const config = {
    externals: {
        jquery: 'jQuery'
    },
    resolve: {},
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        config: 'postcss.config.js'
                    }
                }
            }]
        }, {
            test: /\.(png|jpe?g|gif)$/i,
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]',
                context: path.resolve(__dirname),
                outputPath: '../css',
                publicPath: './'
            }
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://dev.wvps/shop',
            files: ["public/src/*", "admin/src/*", ]
        }),
    ]
};
const adminConfig = Object.assign({}, config, {
    entry: {
        'woo-variable-product-swatches-admin': ['./admin/src/main.js', './admin/src/assets/scss/app.scss']
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'admin/js'),
        clean: true,
    },
    optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'woo-variable-product-swatches-admin-vendor',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new TerserJSPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new MiniCssExtractPlugin({
                filename: '../css/[name].css',
            })
        ],
    }
});
const publicConfig = Object.assign({}, config, {
    entry: {
        'woo-variable-product-swatches-public': ['./public/src/main.js', './public/src/assets/scss/app.scss']
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'public/js'),
        clean: true,
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'woo-variable-product-swatches-public-vendor',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new TerserJSPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new MiniCssExtractPlugin({
                filename: '../css/[name].css',
            })
        ],
    }
});
module.exports = [adminConfig, publicConfig];