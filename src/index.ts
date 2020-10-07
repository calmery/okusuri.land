import * as http from "http";

const httpServer = http.createServer((request, response) => {
  console.log(new Date(), "Received request for", request.url);
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.write("<marquee>💊</marquee>");
  response.end();
});

httpServer.listen(process.env.PORT || 8000);
