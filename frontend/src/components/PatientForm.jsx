import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { patientSchema } from "../utils/validationSchema.js";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      {success && (
        <Box sx={{
          bgcolor: 'success.light',
          color: 'success.dark',
          border: 1,
          borderColor: 'success.main',
          p: 2,
          borderRadius: 1,
          mb: 2
        }}>
          ✓ Patient created successfully
        </Box>
      )}
      <Formik
        initialValues={initialValues || emptyForm}
        validationSchema={patientSchema}
        onSubmit={async (values, { setSubmitting: setFormikSubmitting, resetForm }) => {
          setSubmitting(true);
          setError(null);
          setSuccess(false);
          try {
            await onSubmit(values);
            resetForm();
            setSuccess(true);
          } catch (err) {
            setError(err.message);
          } finally {
            setSubmitting(false);
            setFormikSubmitting(false);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                alignItems: "flex-end",
              }}
            >
              <Field
                as={TextField}
                label="Given name"
                name="givenName"
                required
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{ flex: 1, minWidth: 160 }}
                error={touched.givenName && Boolean(errors.givenName)}
                helperText={touched.givenName && errors.givenName}
              />
              <Field
                as={TextField}
                label="Family name"
                name="familyName"
                required
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{ flex: 1, minWidth: 160 }}
                error={touched.familyName && Boolean(errors.familyName)}
                helperText={touched.familyName && errors.familyName}
              />
              <Field
                as={TextField}
                select
                label="Gender"
                name="gender"
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
              </Field>
              <Field
                as={TextField}
                type="date"
                label="Birth date"
                name="birthDate"
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  flex: 1,
                  minWidth: 140,
                }}
              />
              <Field
                as={TextField}
                label="Phone"
                name="phone"
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{ flex: 1, minWidth: 140 }}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              <Field
                as={TextField}
                label="Email"
                name="email"
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{ flex: 1, minWidth: 160 }}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
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
          </Form>
        )}
      </Formik>
    </Paper>
  );
}