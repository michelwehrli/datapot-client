module.exports = (env) => {
  return [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // For hot reloading,
            experimentalWatchApi: true,
          },
        },
      ],
    },
  ]
}
