import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = "error",
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>{message}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmColor: PropTypes.oneOf(["inherit", "primary", "secondary", "success", "error", "info", "warning"]),
};

export function useConfirmDialog() {
  const resolveRef = useRef(null);
  const [state, setState] = useState({
    open: false,
    title: "Confirm",
    message: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmColor: "error",
  });

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: options.title || "Confirm",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        confirmColor: options.confirmColor || "error",
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setState((s) => ({ ...s, open: false }));
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setState((s) => ({ ...s, open: false }));
  }, []);

  return {
    showConfirmDialog: state.open,
    confirmDialogProps: {
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      confirmColor: state.confirmColor,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
    confirm,
  };
}