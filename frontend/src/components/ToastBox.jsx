import React, { useEffect, useRef, useState } from "react";
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

export default function ToastBox({ type, message, onClose }) {
  const [exiting, setExiting] = useState(false);
  const config = toastConfig[type];
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!onClose) return;
    let mounted = true;
    let timer1;
    let timer2;

    timer1 = setTimeout(() => {
      if (!mounted) return;
      setExiting(true);

      timer2 = setTimeout(() => {
        if (!mounted) return;
        onCloseRef.current?.();
      }, 300);
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onClose]);

  return (
    <Box
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        padding: exiting ? 0 : 1,
        borderRadius: 1,
        marginBottom: exiting ? 0 : 3,
        opacity: exiting ? 0 : 1,
        maxHeight: exiting ? 0 : 48,
        overflow: "hidden",
        transition:
          "opacity 0.3s ease-out, max-height 0.3s ease-out, padding 0.3s ease-out, margin-bottom 0.3s ease-out",
      }}
      role="alert"
    >
      {config.icon} {message}
    </Box>
  );
}

ToastBox.propTypes = {
  type: PropTypes.oneOf(["error", "success", "warning", "information"]).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};