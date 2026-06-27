import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../graphqlClient.js";
import PatientForm from "../components/PatientForm.jsx";
import PatientList from "../components/PatientList.jsx";
import { Box, Typography, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const PATIENTS_QUERY = `
  query Patients($offset: Int!, $limit: Int!) {
    patients(offset: $offset, limit: $limit) {
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
      totalCount
    }
  }
`;

const PAGINATION_CONFIG_QUERY = `
  query PaginationConfig {
    paginationConfig {
      defaultPageSize
      maxPageSize
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
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [defaultPageSize, setDefaultPageSize] = useState(10);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [listVersion, setListVersion] = useState(0);

  useEffect(() => {
    graphqlRequest(PAGINATION_CONFIG_QUERY)
      .then((data) => {
        setDefaultPageSize(data.paginationConfig.defaultPageSize);
        setMaxPageSize(data.paginationConfig.maxPageSize);
        setLimit(data.paginationConfig.defaultPageSize);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadPatients();
  }, [offset, limit, listVersion]);

  async function loadPatients() {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest(PATIENTS_QUERY, { offset, limit });
      setPatients(data.patients.patients);
      setTotalCount(data.patients.totalCount);
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
    setListVersion(v => v + 1);
    setOffset(0);
  }

  function handlePageChange(_event, page) {
    setOffset((page - 1) * limit);
  }

  function handlePageSizeChange(event) {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    setOffset(0);
  }

  const pageCount = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.floor(offset / limit) + 1;

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-label">Page size</InputLabel>
          <Select
            labelId="page-size-label"
            value={limit}
            label="Page size"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={maxPageSize}>{maxPageSize}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <PatientList patients={patients} onPatientDeleted={loadPatients} />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
