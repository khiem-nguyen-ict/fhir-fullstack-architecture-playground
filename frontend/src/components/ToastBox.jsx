import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const toastConfig = {
  error: {
    bgcolor: "error.main",
    color: "#ffffff",
    icon: "⚠",
  },
  success: {
    bgcolor: "success.main",
    color: "#ffffff",
    icon: "✓",
  },
  warning: {
    bgcolor: "warning.main",
    color: "#ffffff",
    icon: "⚠",
  },
  information: {
    bgcolor: "info.main",
    color: "#ffffff",
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