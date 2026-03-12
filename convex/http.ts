import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

const allowedOrigins = [
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:5173",
];
authComponent.registerRoutes(http, createAuth, {
  cors: { allowedOrigins },
});

export default http;
