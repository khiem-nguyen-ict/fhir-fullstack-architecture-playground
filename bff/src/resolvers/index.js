import { patientQueries } from "./patients.js";
import { patientMutations } from "./patients.js";

export const resolvers = {
  Query: patientQueries,
  Mutation: patientMutations,
};