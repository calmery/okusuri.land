const path = require("path");

module.exports = {
  poweredByHeader: false,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src");

    return config;
  },
};
