import React, { useState } from "react";
import { graphqlRequest } from "../graphqlClient.js";

const CREATE_PATIENT_MUTATION = `
  mutation CreatePatient($input: PatientInput!) {
    createPatient(input: $input) {
      id
      fullName
    }
  }
`;

const emptyForm = {
  givenName: "",
  familyName: "",
  gender: "",
  birthDate: "",
  phone: "",
  email: "",
};

export default function PatientForm({ onPatientAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await graphqlRequest(CREATE_PATIENT_MUTATION, {
        input: {
          ...form,
          birthDate: form.birthDate || null,
        },
      });
      setForm(emptyForm);
      onPatientAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <input
          placeholder="Given name"
          value={form.givenName}
          onChange={(e) => setForm({ ...form, givenName: e.target.value })}
          required
        />
        <input
          placeholder="Family name"
          value={form.familyName}
          onChange={(e) => setForm({ ...form, familyName: e.target.value })}
          required
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Gender</option>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
          <option value="unknown">unknown</option>
        </select>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Add Patient"}
        </button>
      </form>
    </section>
  );
}