/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import express from "express";
import helmet from "helmet";
import { router as badges } from "../../services/badges/router";
import { router as client } from "../../services/client/router";
import { router as identity } from "../../services/identity/router";
import { router as posts } from "../../services/posts/router";
import { logger } from "../logger/winston";
import { respond } from "./handler";

const base_path = `/home/node/cypherpost/app/src/services/client/public`;

// ------------------ '(◣ ◢)' ---------------------
export async function start(port: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const server = express();

      server.set("etag", false);
      server.disable("x-powered-by");
      server.use(helmet());
      server.use(express.json());
      server.use(express.urlencoded());
      server.use((err, req, res, next) => {
        if (err) {
          logger.warn({err});
          respond(400,{error:'Invalid Request data format. Try another format like form, or url-encoded.'},res,req)
        } else {
          next()
        }
      });
      
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      server.use("/api/v2/identity", identity);
      server.use("/api/v2/badges", badges);
      server.use("/api/v2/posts", posts);
      server.use("/", client);
      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      server.use(express.static(base_path));
      
      const app = server.listen(port, async () => {
        logger.verbose("Server listening...")
        resolve(app)
      });
      

      // Gracefully terminate server on SIGINT AND SIGTERM
      process.on("SIGINT", () => {
        logger.info({
          SIGINT: "Got SIGINT. Gracefully shutting down Http server"
        });
        app.close(() => {
          logger.info("Http server closed.");
        });
      });

      // quit properly on docker stop
      process.on("SIGTERM", () => {
        logger.info({
          SIGTERM: "Got SIGTERM. Gracefully shutting down Http server."
        });

        app.close(() => {
          logger.info("Http server closed.");
        });
      });

      const sockets = {};

      let nextSocketId = 0;

      app.on("connection", socket => {
        const socketId = nextSocketId++;
        sockets[socketId] = socket;

        socket.once("close", function () {
          delete sockets[socketId];
        });
      });

      // server._router.stack.forEach(print.bind(null, []))
      
      // console.log(JSON.stringify(availableRoutes(server), null, 2));
      // console.log(availableRoutesString(server));


      // listRoutes();
    } catch (e) {
      logger.error({EXPRESS_ERROR:e})
      reject(e);
    }
  });
};

// ------------------ '(◣ ◢)' ---------------------

