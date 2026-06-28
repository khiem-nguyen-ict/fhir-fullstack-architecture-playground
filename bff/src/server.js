import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import dotenv from "dotenv";

dotenv.config({ path: join(import.meta.dirname, "..", ".env") });

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const isProduction = process.env.NODE_ENV === "production";
const ENABLE_GRAPHIQL = process.env.ENABLE_GRAPHIQL !== "false";

const apolloCspSrcs = [
  "https://cdn.jsdelivr.net",
];

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", ...(ENABLE_GRAPHIQL ? ["'unsafe-inline'", ...apolloCspSrcs] : [])],
      styleSrc: ["'self'", ...(ENABLE_GRAPHIQL ? ["'unsafe-inline'", ...apolloCspSrcs] : [])],
      connectSrc: ["'self'", ...(ENABLE_GRAPHIQL ? [...apolloCspSrcs, "http://localhost:*"] : [])],
    },
  },
  xssFilter: true,
  noSniff: true,
  frameguard: { action: "deny" },
}));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const queryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: !isProduction,
  plugins: [
    {
      requestDidStart: async () => ({
        didResolveOperation: ({ request }) => {
          if (request.operationName === "IntrospectionQuery" && isProduction) {
            throw new Error("GraphQL introspection is disabled in production");
          }
        },
      }),
    },
  ],
  formatError: (error) => {
    if (isProduction) {
      return new Error(error.message);
    }
    return error;
  },
});

await server.start();

if (ENABLE_GRAPHIQL) {
  app.get("/graphql", (req, res) => {
    res.sendFile(join(__dirname, "..", "public", "graphiql.html"));
  });
}

app.use(
  "/graphql",
  queryRateLimiter,
  express.json({ limit: "1mb" }),
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

const shouldStart = process.env.NODE_ENV !== "test" || process.env.INIT_SERVER !== "false";
if (shouldStart) {
  httpServer.listen(PORT, () => {
    console.log(`🚀 BFF ready at http://localhost:${PORT}`);
    console.log(
      `   Proxying to patient-service at ${
        process.env.PATIENT_SERVICE_URL || "http://localhost:8081"
      }`
    );
  });
}

export { app, queryRateLimiter, corsOptions, isProduction, ENABLE_GRAPHIQL };