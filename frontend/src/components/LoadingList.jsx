import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function LoadingList({ loading, children, minHeight = 200 }) {
  return (
    <Box sx={{ position: "relative", minHeight }}>
      <Box
        sx={{
          opacity: loading ? 0.5 : 1,
          transition: "opacity 300ms ease-in-out",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </Box>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}