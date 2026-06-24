import { useEffect, useState } from "react";
import { graphqlRequest } from "./graphqlClient.js";

const PATIENTS_QUERY = `
  query Patients {
    patients {
      id
      fullName
      givenName
      familyName
      gender
      birthDate
      phone
      email
    }
  }
`;

const CREATE_PATIENT_MUTATION = `
  mutation CreatePatient($input: PatientInput!) {
    createPatient(input: $input) {
      id
      fullName
    }
  }
`;

const DELETE_PATIENT_MUTATION = `
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
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

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function loadPatients() {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest(PATIENTS_QUERY);
      setPatients(data.patients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await graphqlRequest(CREATE_PATIENT_MUTATION, {
        input: {
          ...form,
          birthDate: form.birthDate || null,
        },
      });
      setForm(emptyForm);
      await loadPatients();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      await graphqlRequest(DELETE_PATIENT_MUTATION, { id });
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>FHIR Full-Stack Architecture Playground</h1>
        <p className="subtitle">React → GraphQL BFF → Patient Service → FHIR</p>
      </header>

      {error && <div className="error">⚠ {error}</div>}

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

      <section className="panel">
        <h2>Patients</h2>
        {loading ? (
          <p>Loading…</p>
        ) : patients.length === 0 ? (
          <p>No patients yet.</p>
        ) : (
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
        )}
      </section>
    </div>
  );
}
