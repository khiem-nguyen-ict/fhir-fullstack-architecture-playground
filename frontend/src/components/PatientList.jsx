import React from "react";
import { graphqlRequest } from "../graphqlClient.js";
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Link, TableSortLabel, TableContainer, useMediaQuery } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormat.js";
import { formatPhone } from "../utils/formatPhone.js";

const DELETE_PATIENT_MUTATION = `
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

function ColumnHeader({ field, label, sortBy, sortDirection, onSort }) {
  return (
    <TableCell>
      <TableSortLabel
        active={sortBy === field}
        direction={sortBy === field ? sortDirection : "asc"}
        onClick={() => onSort && onSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}

export default function PatientList({ patients, onPatientDeleted, sortBy, sortDirection, onSort }) {
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width:600px)");

  async function handleDelete(id) {
    try {
      await graphqlRequest(DELETE_PATIENT_MUTATION, { id });
      onPatientDeleted();
    } catch (err) {
      console.error(err);
    }
  }

  if (!patients || patients.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} role="region" aria-label="Patients list">
        <Typography variant="h2" gutterBottom>
          Patients
        </Typography>
        <Typography>No patients yet.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }} role="region" aria-label="Patients list">
      <Typography variant="h2" gutterBottom>
        Patients
      </Typography>
        <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <ColumnHeader field="fullName" label="Name" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
              {!isXs && (
                <ColumnHeader field="gender" label="Gender" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
              )}
              <ColumnHeader field="birthDate" label="Birth date" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
              {!isXs && (
                <ColumnHeader field="phone" label="Phone" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
              )}
              {!isXs && (
                <ColumnHeader field="email" label="Email" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.fullName}</TableCell>
              {!isXs && (
                <TableCell>{p.gender || "—"}</TableCell>
              )}
              <TableCell>{formatDate(p.birthDate) || "—"}</TableCell>
              {!isXs && (
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.phone || undefined}>
                  {p.phone ? (
                    <Link href={`tel:${p.phone.replace(/[^+\d]/g, "")}`} underline="hover">
                      {formatPhone(p.phone)}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
              )}
              {!isXs && (
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.email || undefined}>
                  {p.email ? (
                    <Link href={`mailto:${p.email}`} underline="hover">
                      {p.email}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
              )}
              <TableCell>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <IconButton 
                    onClick={() => navigate(`/patients/${p.id}`)}
                    color="primary"
                    size="small"
                    aria-label="View details"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(p.id)} 
                    color="error"
                    size="small"
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}