import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages-styling/auth.css";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "demo@studenthub.com",
    password: "password123",
  });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-card fade-up" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to your study hub</h1>
        <p className="helper-text">
          Demo account: <strong>demo@studenthub.com</strong> /{" "}
          <strong>password123</strong>
        </p>

        <label>
          Email
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                email: event.target.value,
              }))
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                password: event.target.value,
              }))
            }
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-button full-width">
          Login
        </button>

        <p className="helper-text">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
