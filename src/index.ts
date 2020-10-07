import * as http from "http";

const httpServer = http.createServer((request, response) => {
  console.log(new Date(), "Received request for", request.url);
  response.writeHead(200);
  response.end();
});

httpServer.listen(process.env.PORT || 8000);
