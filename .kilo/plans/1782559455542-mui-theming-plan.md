# Material-UI Theme Implementation Plan for React Healthcare Application

## Goal
Implement light/dark theme functionality in a React application using Material-UI (MUI) based on research of healthcare dashboard examples.

## Dependencies
- React 16.8+ (for hooks)
- @mui/material
- @mui/icons-material
- @mui/styles
- @emotion/react
- @emotion/styled

## Implementation Plan

### 1. Project Setup
```bash
# Install required packages
npm install @mui/material @mui/icons-material @mui/styles @emotion/react @emotion/styled
# or with yarn
yarn add @mui/material @mui/icons-material @mui/styles @emotion/react @emotion/styled
```

### 2. Theme Creation
Create theme files in `src/theme/`:

**src/theme/theme.js**
```javascript
import { createTheme } from '@mui/material/styles';

// Define color palettes
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#dc004e',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#f48fb1',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

// Create themes
export const lightTheme = createTheme({
  palette: lightPalette,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  // Add custom component overrides if needed
  components: {
    // Example: Customize MUI components
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
        },
      },
    },
  },
});
```

### 3. Theme Context & Provider
Create theme context to manage theme state:

**src/context/ThemeContext.js**
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme/theme';

// Create context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) return savedPrice;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [mode, setMode] = useState(getInitialMode);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
```

### 4. Theme Toggle Component
Create a reusable theme toggle button:

**src/components/ThemeToggle.js**
```javascript
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTransition} aria-label="theme-toggle">
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
```

### 5. Application Integration
Wrap your application with the ThemeProvider:

**src/index.js**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

**Example usage in App.js:**
```javascript
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" flexGrow>
            Healthcare Dashboard
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" py={4}>
        {/* Your dashboard content */}
      </Container>
    </div>
  );
}

export default App;
```

### 6. Using Theme Values in Components
Access theme values using the `useTheme` hook or `sx` prop:

**Example Component:**
```javascript
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Or use your custom theme context hook
// import { useTheme } from '../context/ThemeContext';

const StatsCard = () => {
  const theme = useTheme(); // MUI's theme hook
  
  return (
    <Card 
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Patient Count
        </Typography>
        <Typography variant="h2">
          1,245
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
```

### 7. Persistence & System Preference
The implementation already includes:
- LocalStorage persistence of user preference
- System preference detection on initial load
- Automatic theme switching when system preference changes (optional enhancement)

### 8. Validation & Testing
- **Visual Testing**: Verify both light and dark modes render correctly
- **Accessibility**: Check color contrast ratios meet WCAG guidelines
- **Performance**: Ensure theme switching doesn't cause layout thrashing
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
- **Responsive**: Verify on mobile and desktop breakpoints

### 9. Customization Guidelines
When customizing components:
1. Use theme values via `theme.palette`, `theme.spacing`, etc.
2. Leverage the `sx` prop for theme-aware styling
3. For complex customizations, use `styled()` or `withStyles()`
4. Follow Material Design guidelines for accessibility

### 10. Maintenance Considerations
- Document custom theme variables in `theme/theme.js`
- Keep theme updates minimal to avoid breaking changes
- Consider creating a design token system for larger applications
- Regularly update MUI dependencies for security and features

## Expected Outcome
A fully functional light/dark theme system that:
- Respects user preference stored in localStorage
- Automatically detects system preference on first visit
- Provides seamless theme switching via UI toggle
- Applies consistently across all MUI components
- Maintains accessibility standards in both themes
- Follows Material Design theming best practices

## Files to Create/Modify
1. `src/theme/theme.js` - Theme definitions
2. `src/context/ThemeContext.js` - Theme context and provider
3. `src/components/ThemeToggle.js` - Theme toggle UI component
4. `src/index.js` - Wrap app with ThemeProvider
5. Update existing components to use theme values appropriately

## Dependencies Summary
- @mui/material: ^5.0.0
- @mui/icons-material: ^5.0.0
- @mui/styles: ^5.0.0
- @emotion/react: ^11.0.0
- @emotion/styled: ^11.0.0

This implementation follows the patterns seen in the researched healthcare dashboard examples (like Dreams EMR) which specifically mentioned supporting "Dark, Light & Gradient themes" using Material-UI.