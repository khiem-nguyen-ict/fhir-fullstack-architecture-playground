import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../graphqlClient.js";
import PatientForm from "../components/PatientForm.jsx";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const PATIENT_QUERY = `
  query Patient($id: ID!) {
    patient(id: $id) {
      id
      givenName
      familyName
      gender
      birthDate
      phone
      email
    }
  }
`;

const UPDATE_PATIENT_MUTATION = `
  mutation UpdatePatient($id: ID!, $input: PatientInput!) {
    updatePatient(id: $id, input: $input) {
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

export default function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await graphqlRequest(PATIENT_QUERY, { id });
        if (data.patient) {
          setInitialValues({
            givenName: data.patient.givenName || "",
            familyName: data.patient.familyName || "",
            gender: data.patient.gender || "",
            birthDate: data.patient.birthDate || "",
            phone: data.patient.phone || "",
            email: data.patient.email || "",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [id]);

  async function handleUpdate(form) {
    await graphqlRequest(UPDATE_PATIENT_MUTATION, {
      id,
      input: {
        ...form,
        birthDate: form.birthDate || null,
      },
    });
    navigate("/");
  }

  if (loading) {
    return <Typography>Loading…</Typography>;
  }

  return (
    <PatientForm
      initialValues={initialValues}
      onSubmit={handleUpdate}
      submitButtonText="Save Patient"
      title="Edit Patient"
      onCancel={() => navigate("/")}
    />
  );
}