module.exports = (env) => {
  return [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            publicPath: './dist',
            outputPath: 'images',
          },
        },
      ],
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts',
          },
        },
      ],
    },
    {
      test: /\.(css)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'css',
          },
        },
      ],
    },
    {
      test: /\.html$/i,
      loader: 'html-loader',
    },
  ]
}
