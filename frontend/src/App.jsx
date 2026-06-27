import React, { useEffect, useState } from "react";
import { graphqlRequest } from "./graphqlClient.js";
import PatientForm from "./components/PatientForm.jsx";
import PatientList from "./components/PatientList.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { Box, Container, Typography, CssBaseline } from "@mui/material";

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <header>
          <Typography variant="h4" component="h1" gutterBottom>
            FHIR Full-Stack Architecture Playground
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            React → GraphQL BFF → Patient Service → FHIR
          </Typography>
        </header>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ThemeToggle />
        </Box>

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

        <PatientForm onPatientAdded={loadPatients} />

        {loading ? (
          <Typography>Loading…</Typography>
        ) : (
          <PatientList patients={patients} onPatientDeleted={loadPatients} />
        )}
      </Container>
    </Box>
  );
}