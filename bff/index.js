import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async () => ({}),
});

console.log(`🚀 BFF (GraphQL) ready at ${url}`);
console.log(
  `   Proxying to patient-service at ${
    process.env.PATIENT_SERVICE_URL || "http://localhost:8081"
  }`
);
