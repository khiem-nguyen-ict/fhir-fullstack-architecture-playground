import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../graphqlClient.js";
import PatientForm from "../components/PatientForm.jsx";
import PatientList from "../components/PatientList.jsx";
import { Box, Typography } from "@mui/material";

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

export default function PatientsPage() {
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

  async function handleCreate(form) {
    await graphqlRequest(CREATE_PATIENT_MUTATION, {
      input: {
        ...form,
        birthDate: form.birthDate || null,
      },
    });
    loadPatients();
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <Box>
      {error && (
        <Box sx={{
          bgcolor: 'error.light',
          color: 'error.dark',
          border: 1,
          borderColor: 'error.main',
          p: 2,
          borderRadius: 1,
          mb: 2
        }}>
          ⚠ {error}
        </Box>
      )}

      <PatientForm onSubmit={handleCreate} />

      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <PatientList patients={patients} onPatientDeleted={loadPatients} />
      )}
    </Box>
  );
}