import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Container, Typography, CssBaseline } from "@mui/material";
import PatientsPage from "./pages/PatientsPage.jsx";
import EditPatientPage from "./pages/EditPatientPage.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
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

          <main>
            <Routes>
              <Route path="/" element={<PatientsPage />} />
              <Route path="/patients/:id" element={<EditPatientPage />} />
            </Routes>
          </main>
        </Container>
      </Box>
    </>
  );
}