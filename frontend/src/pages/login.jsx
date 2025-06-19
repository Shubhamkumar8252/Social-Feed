import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const dummyUsers = [
  { username: "celebrity1", password: "123456" },
  { username: "celebrity2", password: "123456" },
  { username: "public1", password: "123456" },
  { username: "public2", password: "123456" }
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });
      const userData = { username: res.data.username, role: res.data.role };
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (res.data.role === "celebrity") navigate("/celebrity");
      else navigate("/public");
    } catch {
      alert("Invalid credentials");
    }
  };

  const fillDummy = (u) => {
    setUsername(u.username);
    setPassword(u.password);
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Login to Your Account</h2>

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button
          className={`login-button ${username && password ? "active" : "disabled"}`}
          onClick={handleLogin}
          disabled={!username || !password}
        >
          Login
        </button>

        <p className="login-note">Or use a dummy user</p>

        <div className="dummy-buttons">
          {dummyUsers.map((u) => (
            <button
              key={u.username}
              onClick={() => fillDummy(u)}
              className="dummy-button"
            >
              {u.username}
            </button>
          ))}
        </div>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
