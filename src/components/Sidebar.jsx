import { Link } from "react-router-dom";
import "tailwindcss";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">IoT Dashboard</h2>
      <nav className="space-y-4">
        <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
          🏠 Dashboard
        </Link>
        <Link to="/controls" className="block p-2 hover:bg-gray-700 rounded">
          ⚙️ Controls
        </Link>
        <Link to="/history" className="block p-2 hover:bg-gray-700 rounded">
          📜 History
        </Link>
        <Link to="/settings" className="block p-2 hover:bg-gray-700 rounded">
          🔧 Settings
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
