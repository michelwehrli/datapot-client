module.exports = () => {
  return [
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'style-loader', // Creates style nodes from JS strings
          options: {
            injectType: 'singletonStyleTag',
          },
        },
        {
          loader: 'css-loader', // Translates CSS into CommonJS
        },
        {
          loader: 'postcss-loader', // More CSS Plugins
          options: {
            postcssOptions: {
              plugins: [require('autoprefixer')],
            },
          },
        },
        {
          loader: 'sass-loader', // Compiles Sass to CSS, using Node Sass by default
        },
      ],
    },
  ]
}
