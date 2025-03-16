import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ✅ Corrected Tailwind import (relative path)
import supabase from "./services/supabaseClient"; // ✅ Import Supabase
import { AuthProvider } from "./context/AuthContext";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
