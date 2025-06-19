import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("public");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", { username, password, role });
      const userData = { username: res.data.username, role: res.data.role };
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (res.data.role === "celebrity") navigate("/celebrity");
      else navigate("/public");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Your Account</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="celebrity">Celebrity</option>
          <option value="public">Public</option>
        </select>

        <button onClick={handleRegister} disabled={!username || !password}>
          Register
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/" className="register-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
