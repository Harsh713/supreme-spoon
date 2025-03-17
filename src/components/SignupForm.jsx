import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Signup successful! Check your email to confirm your account.");
      setEmail("");
      setPassword("");

      // Optionally redirect after a delay
      setTimeout(() => navigate("/login"), 5000);
    }
  };

  return (
    <div className="bg-cyan-200 rounded-xl flex flex-col items-center p-6">
      <h2 className="text-blue-900 text-xl font-bold mb-4">Signup</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSignup} className="flex flex-col space-y-4 w-80">
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
          Signup
        </button>
      </form>

      <p className=" bg-blue-400 rounded mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-red-800">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
