import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ✅ Corrected Tailwind import (relative path)
import supabase from "./services/supabaseClient"; // ✅ Import Supabase

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
