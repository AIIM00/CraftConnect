import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";
const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.accent,
    },
    background: {
      default: COLORS.bg,
      paper: COLORS.surface,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.textMuted,
    },
    success: {
      main: COLORS.success,
    },
    warning: {
      main: COLORS.warning,
    },
    error: {
      main: COLORS.error,
    },
    info: {
      main: COLORS.info,
    },
  },
});

export default theme;
