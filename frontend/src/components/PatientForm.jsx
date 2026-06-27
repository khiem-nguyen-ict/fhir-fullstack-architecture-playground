import React, { useState } from "react";
import { graphqlRequest } from "../graphqlClient.js";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";

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
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Patient
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "flex-end",
        }}
      >
        <TextField
          label="Given name"
          value={form.givenName}
          onChange={(e) => setForm({ ...form, givenName: e.target.value })}
          required
          size="small"
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="Family name"
          value={form.familyName}
          onChange={(e) => setForm({ ...form, familyName: e.target.value })}
          required
          size="small"
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          select
          label="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          size="small"
          sx={{ flex: 1, minWidth: 120 }}
        >
          <MenuItem value="">Gender</MenuItem>
          <MenuItem value="male">male</MenuItem>
          <MenuItem value="female">female</MenuItem>
          <MenuItem value="other">other</MenuItem>
          <MenuItem value="unknown">unknown</MenuItem>
        </TextField>
        <TextField
          type="date"
          label="Birth date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            flex: 1,
            minWidth: 140,
            '& input[type="date"]': {
              color: "transparent",
            },
            '& input[type="date"]:focus': {
              color: "inherit",
            },
          }}
        />
        <TextField
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          size="small"
          sx={{ flex: 1, minWidth: 140 }}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          size="small"
          sx={{ flex: 1, minWidth: 160 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ height: 40, px: 2 }}
        >
          {submitting ? "Saving…" : "Add Patient"}
        </Button>
      </Box>
    </Paper>
  );
}
