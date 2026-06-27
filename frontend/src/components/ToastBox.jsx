import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const toastConfig = {
  error: {
    bgcolor: "error.light",
    color: "error.dark",
    borderColor: "error.main",
    icon: "⚠",
  },
  success: {
    bgcolor: "success.light",
    color: "success.dark",
    borderColor: "success.main",
    icon: "✓",
  },
  warning: {
    bgcolor: "warning.light",
    color: "warning.dark",
    borderColor: "warning.main",
    icon: "⚠",
  },
  information: {
    bgcolor: "info.light",
    color: "info.dark",
    borderColor: "info.main",
    icon: "ℹ",
  },
};

export default function ToastBox({ type, message }) {
  const config = toastConfig[type];

  return (
    <Box
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        border: 1,
        borderColor: config.borderColor,
        p: 1,
        borderRadius: 1,
        mb: 3,
      }}
    >
      {config.icon} {message}
    </Box>
  );
}

ToastBox.propTypes = {
  type: PropTypes.oneOf(["error", "success", "warning", "information"]).isRequired,
  message: PropTypes.string.isRequired,
};