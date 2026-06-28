import React, { useEffect, useState, useCallback } from "react";
import { graphqlRequest } from "../graphqlClient.js";
import PatientForm from "../components/PatientForm.jsx";
import PatientList from "../components/PatientList.jsx";
import PatientSearch from "../components/PatientSearch.jsx";
import { Box, Typography, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ToastBox from "../components/ToastBox.jsx";

const PATIENTS_QUERY = `
  query Patients($offset: Int!, $limit: Int!, $sortBy: String, $sortDirection: String, $search: String, $filterField: [String], $filterValue: [String]) {
    patients(offset: $offset, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection, search: $search, filterField: $filterField, filterValue: $filterValue) {
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
  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem("patientPageSize");
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 10;
  });
  const [defaultPageSize, setDefaultPageSize] = useState(10);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [listVersion, setListVersion] = useState(0);
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");

  const [searchMode, setSearchMode] = useState("general");
  const [generalSearch, setGeneralSearch] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState({
    givenName: "",
    familyName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
  });
  const [committedSearch, setCommittedSearch] = useState({
    mode: "general",
    generalSearch: "",
    advancedSearch: {
      givenName: "",
      familyName: "",
      gender: "",
      birthDate: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    graphqlRequest(PAGINATION_CONFIG_QUERY)
      .then((data) => {
        setDefaultPageSize(data.paginationConfig.defaultPageSize);
        setMaxPageSize(data.paginationConfig.maxPageSize);
        setLimit((prev) => {
          const saved = localStorage.getItem("patientPageSize");
          if (saved) {
            const parsed = Number(saved);
            if (!isNaN(parsed) && parsed > 0) return parsed;
          }
          return data.paginationConfig.defaultPageSize;
        });
      })
      .catch(() => {});
  }, []);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { mode, generalSearch: search, advancedSearch: adv } = committedSearch;
      const variables = {
        offset,
        limit,
        sortBy,
        sortDirection,
        search: mode === "general" && search.trim() !== "" ? search : undefined,
        filterField: undefined,
        filterValue: undefined,
      };

      if (mode === "advanced") {
        const fields = [];
        const values = [];
        Object.entries(adv).forEach(([field, value]) => {
          if (value && value.trim() !== "") {
            fields.push(field);
            values.push(value.trim());
          }
        });
        if (fields.length > 0) {
          variables.filterField = fields;
          variables.filterValue = values;
        }
      }

      const data = await graphqlRequest(PATIENTS_QUERY, variables);
      setPatients(data.patients.patients);
      setTotalCount(data.patients.totalCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listVersion is intentionally included to trigger reloads
  }, [offset, limit, sortBy, sortDirection, committedSearch, listVersion]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Standard data-fetching pattern
    loadPatients();
  }, [loadPatients]);

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
    localStorage.setItem("patientPageSize", newLimit);
    setOffset(0);
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setOffset(0);
  }

  function handleSearchModeChange(_event, newMode) {
    if (newMode !== null) {
      setSearchMode(newMode);
    }
  }

  function handleGeneralSearchChange(event) {
    setGeneralSearch(event.target.value);
  }

  function handleAdvancedSearchChange(field, value) {
    setAdvancedSearch(prev => ({ ...prev, [field]: value }));
  }

  function handleClearSearch() {
    setGeneralSearch("");
    setAdvancedSearch({
      givenName: "",
      familyName: "",
      gender: "",
      birthDate: "",
      phone: "",
      email: "",
    });
    setCommittedSearch({
      mode: searchMode,
      generalSearch: "",
      advancedSearch: {
        givenName: "",
        familyName: "",
        gender: "",
        birthDate: "",
        phone: "",
        email: "",
      },
    });
    setOffset(0);
  }

  function handleSearchClick() {
    setCommittedSearch({
      mode: searchMode,
      generalSearch,
      advancedSearch: { ...advancedSearch },
    });
    setOffset(0);
  }

  const pageCount = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <Box>
      {error && (
        <ToastBox type="error" message={error} />
      )}

      <PatientForm onSubmit={handleCreate} />

      <PatientSearch
        searchMode={searchMode}
        onModeChange={handleSearchModeChange}
        generalSearch={generalSearch}
        onGeneralSearchChange={handleGeneralSearchChange}
        advancedSearch={advancedSearch}
        onAdvancedSearchChange={handleAdvancedSearchChange}
        onClearSearch={handleClearSearch}
        onSearch={handleSearchClick}
      />

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
        <PatientList patients={patients} onPatientDeleted={loadPatients} sortBy={sortBy} sortDirection={sortDirection} onSort={handleSort} />
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
