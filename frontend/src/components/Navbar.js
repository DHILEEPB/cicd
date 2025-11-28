import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.roles.includes('ROLE_ADMIN')) {
      return <Link to="/admin/dashboard">Admin Dashboard</Link>;
    } else if (user.roles.includes('ROLE_DONOR')) {
      return <Link to="/donor/dashboard">Donor Dashboard</Link>;
    } else if (user.roles.includes('ROLE_PATIENT')) {
      return <Link to="/patient/dashboard">Patient Dashboard</Link>;
    }
    return null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Blood Bank Management
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              {getDashboardLink()}
              <span>{user.firstName} {user.lastName}</span>
              <a href="#" onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

