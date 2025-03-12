import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* 🔹 Navigation Bar */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">IoT Dashboard</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/controls" className="hover:underline">Controls</Link>
          <Link to="/history" className="hover:underline">History</Link>
          <Link to="/settings" className="hover:underline">Settings</Link>
        </div>
      </nav>

      {/* 🔹 Render child routes */}
      <div className="p-6">
        <Outlet />  {/* ✅ This is required to load pages! */}
      </div>
    </div>
  );
};

export default Layout;
