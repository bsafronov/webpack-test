import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type ExtendedConfiguration = Configuration & {
  devServer?: {
    static?: any;
    port?: number;
    hot?: boolean;
    compress?: boolean;
  };
};

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV);

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config: ExtendedConfiguration = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 4000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
};

if (isProduction) {
  config.plugins?.push(new MiniCssExtractPlugin());
}

if (!isProduction) {
  config.devtool = "eval";
}

export default config;
