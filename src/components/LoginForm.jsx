import { useState } from "react";
import supabase from "../services/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // ✅ Store user session
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/"); // ✅ Redirect to Dashboard
    }
  };

  return (
    <div className="bg-cyan-200 rounded-xl flex flex-col items-center p-6">
      <h2 className="text-blue-900 text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-900 text-white p-2 rounded">
          Login
        </button>
      </form>
      <p className=" bg-blue-400 rounded mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="text-red-800">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
