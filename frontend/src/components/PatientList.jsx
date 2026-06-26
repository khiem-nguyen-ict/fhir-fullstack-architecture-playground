import React from "react";
import { graphqlRequest } from "../graphqlClient.js";

const DELETE_PATIENT_MUTATION = `
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

export default function PatientList({ patients, onPatientDeleted }) {
  async function handleDelete(id) {
    try {
      await graphqlRequest(DELETE_PATIENT_MUTATION, { id });
      onPatientDeleted();
    } catch (err) {
      console.error(err);
    }
  }

  if (patients.length === 0) {
    return (
      <section className="panel">
        <h2>Patients</h2>
        <p>No patients yet.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Patients</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Birth date</th>
            <th>Phone</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.fullName}</td>
              <td>{p.gender || "—"}</td>
              <td>{p.birthDate || "—"}</td>
              <td>{p.phone || "—"}</td>
              <td>{p.email || "—"}</td>
              <td>
                <button onClick={() => handleDelete(p.id)} className="link-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}