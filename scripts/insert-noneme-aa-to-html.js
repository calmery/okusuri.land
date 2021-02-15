const fs = require("fs");
const path = require("path");
const glob = require("glob");

const nonemeAsciiArt = fs.readFileSync(
  path.resolve(__dirname, "./noneme"),
  "utf-8"
);

const pagesPath = path.resolve(__dirname, "../.next/serverless/pages");

glob(`${pagesPath}/*.html`, {}, (_, files) => {
  files.forEach((file) => {
    const baseHtml = fs.readFileSync(file, "utf8");
    const html = `<!--\n${nonemeAsciiArt}-->${baseHtml}`;
    fs.writeFileSync(file, html);
  });
});
