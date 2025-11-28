import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="hero">
        <h1>Blood Bank Management System</h1>
        <p>Connecting donors with hospitals and blood banks</p>
        {!user && (
          <div>
            <Link to="/signup" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </div>
      <div className="container">
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <h2>Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card">
              <h3>Donor Management</h3>
              <p>Register as a donor and help save lives by donating blood.</p>
            </div>
            <div className="card">
              <h3>Blood Inventory</h3>
              <p>Track blood stock levels for all blood groups in real-time.</p>
            </div>
            <div className="card">
              <h3>Request Management</h3>
              <p>Request blood when needed and track request status.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

