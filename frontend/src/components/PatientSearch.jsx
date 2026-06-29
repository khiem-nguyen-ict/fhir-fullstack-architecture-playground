import React from "react";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

const ADVANCED_FIELDS = [
  { key: "givenName", label: "Given name" },
  { key: "familyName", label: "Family name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
];

export default function PatientSearch({
  searchMode,
  onModeChange,
  generalSearch,
  onGeneralSearchChange,
  advancedSearch,
  onAdvancedSearchChange,
  onClearSearch,
  onSearch,
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <ToggleButtonGroup
        exclusive
        value={searchMode}
        onChange={onModeChange}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="general">General</ToggleButton>
        <ToggleButton value="advanced">Advanced</ToggleButton>
      </ToggleButtonGroup>

      {searchMode === "general" ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search by name, email, or phone..."
            value={generalSearch}
            onChange={onGeneralSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={onSearch} size="small" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {ADVANCED_FIELDS.map(({ key, label }) => (
              <TextField
                key={key}
                size="small"
                fullWidth
                label={label}
                value={advancedSearch[key]}
                onChange={(e) => onAdvancedSearchChange(key, e.target.value)}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Box
              component="button"
              onClick={onClearSearch}
              sx={{
                background: "none",
                border: "none",
                color: "text.primary",
                cursor: "pointer",
                fontSize: "inherit",
                textDecoration: "underline",
                px: 0,
                py: 0.5,
              }}
            >
              Clear search
            </Box>
            <Box sx={{ flex: 1 }} />
            <Button variant="contained" onClick={onSearch} size="small" startIcon={<SearchIcon />}>
              Search
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

PatientSearch.propTypes = {
  searchMode: PropTypes.oneOf(["general", "advanced"]).isRequired,
  onModeChange: PropTypes.func.isRequired,
  generalSearch: PropTypes.string.isRequired,
  onGeneralSearchChange: PropTypes.func.isRequired,
  advancedSearch: PropTypes.shape({
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onAdvancedSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};