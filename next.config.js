const path = require("path");

module.exports = {
  poweredByHeader: false,
  webpack: (config, options) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src");

    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    return config;
  },
};
