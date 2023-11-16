const extractTextPlugin = require("extract-text-webpack-plugin");
const rules = [
  {
    test: /\.(css|scss|sass)$/,
    // 区别开发环境和生成环境
    use:
      process.env.NODE_ENV === "development"
        ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
        : extractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader", "postcss-loader"],
            // css中的基础路径
            publicPath: "./"
          })
  },
  {
    test: /\.js$/,
    use: [
      {
        loader: "babel-loader"
      }
    ],
    exclude: "/node_modules/"
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader"
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        // 需要下载url-loader
        loader: "url-loader",
        options: {
          limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
          // 图片文件输出的文件夹
          publicPath: "../../images",
          outputPath: "images"
        }
      }
    ]
  },
  {
    test: /\.html$/,
    // html中的img标签
    use: {
      loader: "html-loader",
      options: {
        attrs: ["img:src", "img:data-src", "audio:src"],
        minimize: true
      }
    }
  },
  {
    test: /\.art$/,
    loader: "art-template-loader",
    options: {
      // art-template options (if necessary)
      // @see https://github.com/aui/art-template
    }
  },
  {
    test: /\.woff(2)?(\?[a-z0-9]+)?$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff"
  }, 
  {
    test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
    loader: "file-loader"
  }
];
module.exports = rules;
