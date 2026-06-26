import { useEffect, useState } from "react";
import { graphqlRequest } from "./graphqlClient.js";
import PatientForm from "./components/PatientForm.jsx";
import PatientList from "./components/PatientList.jsx";

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

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="app">
      <header>
        <h1>FHIR Full-Stack Architecture Playground</h1>
        <p className="subtitle">React → GraphQL BFF → Patient Service → FHIR</p>
      </header>

      {error && <div className="error">⚠ {error}</div>}

      <PatientForm onPatientAdded={loadPatients} />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <PatientList patients={patients} onPatientDeleted={loadPatients} />
      )}
    </div>
  );
}