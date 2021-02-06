const path = require("path");

module.exports = {
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src");

    return config;
  },
};
