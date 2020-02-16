module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-env"
  ],
  plugins: [
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-transform-react-jsx",
    "transform-react-pug",
    "transform-class-properties",
  ]
};

