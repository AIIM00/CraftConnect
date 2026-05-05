import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.js";

//Global Setup
// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppProvider>
  </BrowserRouter>,
);
