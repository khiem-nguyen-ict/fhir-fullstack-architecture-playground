import { createTheme } from "@mui/material/styles";

// ---- shared tokens ----
const radius = {
  sm: 8, // inputs, buttons
  pill: 999, // chips, status badges
  card: 14, // cards/panels
  modal: 16, // modals
};

const fontFamily =
  '"Inter", "-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// ---- light palette ----
const lightPalette = {
  mode: "light",
  primary: {
    main: "#1D4ED8", // AA-safe blue on white (was violet #6D28D9)
    light: "#3B82F6", // ok for large fills/buttons
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#0F6E56", // teal, AA-safe on white
    contrastText: "#FFFFFF",
  },
  success: { main: "#16A34A", contrastText: "#FFFFFF" },
  warning: { main: "#92400E", contrastText: "#FFFFFF" }, // text-safe amber; use bg tint #FEF3C7 for fills
  error: { main: "#DC2626", contrastText: "#FFFFFF" },
  info: { main: "#1E40AF", contrastText: "#FFFFFF" },
  background: {
    default: "#FAFAFB",
    paper: "#FFFFFF",
  },
  divider: "#E5E7EB",
  text: {
    primary: "#1A1D21",
    secondary: "#5B6472", // AA-verified ≥4.5:1 on #FFFFFF and #FAFAFB
    disabled: "#9AA0A8",
  },
};

// ---- dark palette ----
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#60A5FA", // lightened blue, AA-safe on dark surfaces (was violet #A78BFA)
    contrastText: "#14151A",
  },
  secondary: {
    main: "#4ADE80",
    contrastText: "#14151A",
  },
  success: { main: "#4ADE80", contrastText: "#14151A" },
  warning: { main: "#FBBF24", contrastText: "#1A1D21" },
  error: { main: "#F87171", contrastText: "#1A1D21" },
  info: { main: "#93C5FD", contrastText: "#1A1D21" },
  background: {
    default: "#14151A",
    paper: "#1C1E24",
  },
  divider: "#3A3D45", // lightened from #2A2D33 — previous value blended into paper (#1C1E24)
  text: {
    primary: "#F2F3F5",
    secondary: "#A1A6AD", // AA-verified ≥4.5:1 on #1C1E24
    disabled: "#6B7280",
  },
};

// ---- shared component overrides (mode-aware via callback) ----
const getComponents = (palette) => ({
  MuiCssBaseline: {
    styleOverrides: {
      // respect reduced-motion preference
      "@media (prefers-reduced-motion: reduce)": {
        "*": {
          animationDuration: "0.001ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.001ms !important",
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        borderBottom: `1px solid ${palette.divider}`,
        boxShadow: "none",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: radius.card,
        border: `1px solid ${palette.divider}`,
        boxShadow: "none",
        backgroundColor: palette.background.paper,
        transition: "box-shadow 150ms ease, border-color 150ms ease",
        "&:hover": {
          boxShadow:
            palette.mode === "light"
              ? "0 2px 8px rgba(0,0,0,0.06)"
              : "0 2px 8px rgba(0,0,0,0.4)",
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 24, // theme.spacing(3)
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: radius.sm,
        textTransform: "none",
        fontWeight: 500,
        minHeight: 44, // touch target
        "&:focus-visible": {
          outline: `2px solid ${palette.primary.main}`,
          outlineOffset: 2,
        },
      },
      // pill-style action buttons: <Button className="pill">
      pill: {
        borderRadius: radius.pill,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: 44,
        minHeight: 44,
        "&:focus-visible": {
          outline: `2px solid ${palette.primary.main}`,
          outlineOffset: 2,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: radius.pill,
        height: 26,
        fontSize: 12,
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: radius.sm,
        "& fieldset": {
          borderColor: palette.divider,
        },
        "&:focus-within fieldset, &.Mui-focused fieldset": {
          borderColor: palette.primary.main,
          borderWidth: 2,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 2,
        backgroundColor: palette.primary.main,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 500,
        "&.Mui-selected": {
          fontWeight: 700, // non-color cue for active tab (WCAG: don't rely on color alone)
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: radius.pill,
        height: 6,
        backgroundColor: palette.divider,
      },
      bar: {
        borderRadius: radius.pill,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: radius.modal,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: palette.divider,
      },
    },
  },
});

const typography = {
  fontFamily,
  h1: { fontWeight: 600 },
  h2: { fontWeight: 600 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600, fontSize: 16 }, // card titles
  body1: { fontSize: 14 },
  body2: { fontSize: 13, fontWeight: 500 }, // metadata labels
  caption: { fontSize: 12 },
  button: { fontWeight: 500, textTransform: "none" },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  shape: { borderRadius: 12 },
  typography,
  components: getComponents(lightPalette),
});

export const darkTheme = createTheme({
  palette: darkPalette,
  shape: { borderRadius: 12 },
  typography,
  components: getComponents(darkPalette),
});
