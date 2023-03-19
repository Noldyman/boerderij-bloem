import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: {
      paper: "#b7d0d2",
      default: "#fff4eb",
    },
    primary: {
      main: "#3f5946",
    },
    secondary: {
      main: "#cc8020",
    },
    info: {
      main: "#b7d0d2",
      contrastText: "25362a",
    },
    error: {
      main: "#c73e1d",
    },
    success: {
      main: "#4a934a",
    },
    text: {
      primary: "#25362a",
    },
    divider: "rgba(0,0,0,0.2)",
  },
});
