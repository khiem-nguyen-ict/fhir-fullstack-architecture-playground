export const typeDefs = `#graphql
  type Patient {
    id: ID!
    givenName: String!
    familyName: String!
    fullName: String!
    gender: String
    birthDate: String
    phone: String
    email: String
  }

  input PatientInput {
    givenName: String!
    familyName: String!
    gender: String
    birthDate: String
    phone: String
    email: String
  }

  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
  }

  type Mutation {
    createPatient(input: PatientInput!): Patient!
    updatePatient(id: ID!, input: PatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
  }
`;
