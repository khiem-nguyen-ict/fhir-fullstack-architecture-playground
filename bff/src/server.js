import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  graphiql: true,
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server)
);

const publicDir = join(__dirname, "..", "public");
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.get("/", (req, res) => {
  if (req.headers.accept?.includes("text/html")) {
    res.redirect("/graphql");
  } else {
    const indexPath = join(__dirname, "..", "public", "index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.redirect("http://localhost:5173");
    }
  }
});

app.get("*", (req, res) => {
  if (!req.path.includes(".")) {
    const indexPath = join(__dirname, "..", "public", "index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.redirect("http://localhost:5173");
    }
  }
});

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🚀 BFF ready at http://localhost:${PORT}`);
  console.log(
    `   Proxying to patient-service at ${
      process.env.PATIENT_SERVICE_URL || "http://localhost:8081"
    }`
  );
});