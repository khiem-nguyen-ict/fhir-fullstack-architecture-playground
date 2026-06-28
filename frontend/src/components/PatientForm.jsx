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
import ToastBox from "./ToastBox.jsx";

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
      {error && <ToastBox type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <ToastBox type="success" message="Patient created successfully" onClose={() => setSuccess(false)} />
      )}
      <Formik
        initialValues={initialValues || emptyForm}
        validationSchema={patientSchema}
        onSubmit={async (
          values,
          { setSubmitting: setFormikSubmitting, resetForm }
        ) => {
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
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
                alignItems: "start",
              }}
            >
              <Field
                as={TextField}
                label="Given name"
                name="givenName"
                required
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                error={touched.givenName && Boolean(errors.givenName)}
                helperText={touched.givenName && errors.givenName}
              />
              <Field
                as={TextField}
                label="Family name"
                name="familyName"
                required
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                error={touched.familyName && Boolean(errors.familyName)}
                helperText={touched.familyName && errors.familyName}
              />
              <Field
                as={TextField}
                select
                label="Gender"
                name="gender"
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
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
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <Field
                as={TextField}
                label="Phone"
                name="phone"
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              <Field
                as={TextField}
                label="Email"
                name="email"
                fullWidth
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  gridColumn: "1 / -1",
                  mt: 0.5,
                  justifyContent: "flex-end",
                }}
              >
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
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}