import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} aria-label="theme-toggle">
        {mode === 'light' ? (
          <Brightness4 fontSize="large" />
        ) : (
          <Brightness7 fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;