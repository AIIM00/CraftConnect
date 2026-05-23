import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import axios from "axios";
import ScrollToTop from "./components/ScrollToTop";
import "leaflet/dist/leaflet.css";

//Global Setup
// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
);
