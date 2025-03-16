import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./services/supabaseClient";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Controls from "./pages/Controls";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Fetched user:", user); // 🔍 Debugging
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Save session safely
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session); // 🔍 Debugging
      setUser(session?.user || null);
      localStorage.setItem("user", JSON.stringify(session?.user || null)); // ✅ Sync session state
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Protected Routes (Requires Login) */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />} >
          <Route index element={<Dashboard />} />
          <Route path="controls" element={<Controls />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ✅ Public Routes (Login & Signup) */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />


        {/* ✅ Redirect all unknown routes */}
        <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
