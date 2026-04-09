import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages-styling/auth.css";

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    password: "",
  });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = register(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-card fade-up" onSubmit={handleSubmit}>
        <p className="eyebrow">Create account</p>
        <h1>Join the collaboration hub</h1>
        <p className="helper-text">
          Start with a lightweight local account so you can demo the full app
          flow.
        </p>

        <label>
          Full name
          <input
            type="text"
            value={formData.name}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
            required
          />
        </label>

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
          Course
          <input
            type="text"
            value={formData.course}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                course: event.target.value,
              }))
            }
            placeholder="Software Engineering"
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
            minLength="6"
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-button full-width">
          Create account
        </button>

        <p className="helper-text">
          Already registered? <Link to="/login">Go to login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
