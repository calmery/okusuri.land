import * as http from "http";
import { server as Server } from "websocket";

const httpServer = http.createServer();
httpServer.listen(process.env.PORT || 8000);

const server = new Server({ httpServer, autoAcceptConnections: true });
