require("nextjs-sitemap-generator")({
  baseUrl: "https://okusuri.land",
  ignoredExtensions: ["js", "map"],
  ignoredPaths: ["404", "/cheki/"],
  pagesDirectory: __dirname + "/../.next/serverless/pages",
  targetDirectory: "public/",
});
