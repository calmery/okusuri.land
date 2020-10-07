module.exports = {
  "**/*": () => require("./package.json")["lint-staged"]["**/*"] || "",
};
