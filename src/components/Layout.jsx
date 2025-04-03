import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Fetched user:", user); // 🔍 Debugging
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth State Changed:", session?.user); // 🔍 Debugging
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">IoT Dashboard</h1>

        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/" className="hover:underline">Dashboard</Link>
              <Link to="/controls" className="hover:underline">Controls</Link>
              <Link to="/history" className="hover:underline">History</Link>
              <Link to="/settings" className="hover:underline">Settings</Link>
              {/* <Link to="/camera" className="hover:underline">📷 Camera</Link>  */}
              <button 
                onClick={async () => { 
                  await supabase.auth.signOut(); 
                  setUser(null);
                  navigate("/login"); 
                }} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ✅ Show Login & Signup when not logged in */}
              <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">Login</Link>
              <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">Signup</Link>
            </>
          )}
        </div>
      </nav>

      {/* 🔄 Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
