import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages-styling/navbar.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Student Collaboration Hub</p>
        <h1>Work together with structure.</h1>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/groups">Groups</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <div className="nav-user">
        <div>
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.course}</span>
        </div>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
