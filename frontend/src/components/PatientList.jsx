import React from "react";
import { graphqlRequest } from "../graphqlClient.js";
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Link } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormat.js";
import { formatPhone } from "../utils/formatPhone.js";

const DELETE_PATIENT_MUTATION = `
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

export default function PatientList({ patients, onPatientDeleted }) {
  const navigate = useNavigate();

  async function handleDelete(id) {
    try {
      await graphqlRequest(DELETE_PATIENT_MUTATION, { id });
      onPatientDeleted();
    } catch (err) {
      console.error(err);
    }
  }

  if (patients.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Patients
        </Typography>
        <Typography>No patients yet.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Patients
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Birth date</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.fullName}</TableCell>
              <TableCell>{p.gender || "—"}</TableCell>
              <TableCell>{formatDate(p.birthDate) || "—"}</TableCell>
              <TableCell>
                {p.phone ? (
                  <Link href={`tel:${p.phone.replace(/[^+\d]/g, "")}`} underline="hover">
                    {formatPhone(p.phone)}
                  </Link>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {p.email ? (
                  <Link href={`mailto:${p.email}`} underline="hover">
                    {p.email}
                  </Link>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                <IconButton 
                  onClick={() => navigate(`/patients/${p.id}`)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(p.id)} 
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}