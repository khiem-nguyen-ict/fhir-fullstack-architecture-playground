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

  type PatientPage {
    patients: [Patient!]!
    totalCount: Int!
  }

  type PaginationConfig {
    defaultPageSize: Int!
    maxPageSize: Int!
  }

  type Query {
    patients(offset: Int = 0, limit: Int, sortBy: String, sortDirection: String): PatientPage!
    patient(id: ID!): Patient
    paginationConfig: PaginationConfig!
  }

  type Mutation {
    createPatient(input: PatientInput!): Patient!
    updatePatient(id: ID!, input: PatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
  }
`;
