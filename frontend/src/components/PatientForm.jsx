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

const emptyForm = {
  givenName: "",
  familyName: "",
  gender: "",
  birthDate: "",
  phone: "",
  email: "",
};

export default function PatientForm({
  initialValues,
  onSubmit,
  submitButtonText,
  title,
  onCancel,
}) {
  const [form, setForm] = useState(initialValues || emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title || "Add Patient"}
      </Typography>
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
          slotProps={{
                inputLabel: { shrink: true },
            }}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="Family name"
          value={form.familyName}
          onChange={(e) => setForm({ ...form, familyName: e.target.value })}
          required
          size="small"
          slotProps={{
                inputLabel: { shrink: true },
            }}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          select
          label="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          size="small"
          slotProps={{
                inputLabel: { shrink: true },
            }}
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
            slotProps={{
                inputLabel: { shrink: true },
            }}
            sx={{
                flex: 1,
                minWidth: 140,
            }}
            />
        <TextField
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          size="small"
          slotProps={{
                inputLabel: { shrink: true },
            }}
          sx={{ flex: 1, minWidth: 140 }}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          size="small"
          slotProps={{
                inputLabel: { shrink: true },
            }}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ height: 40, px: 2 }}
        >
          {submitting ? "Saving…" : submitButtonText || "Add Patient"}
        </Button>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ height: 40, px: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Paper>
  );
}