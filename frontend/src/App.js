import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/donor/dashboard"
              element={
                <PrivateRoute roles={['ROLE_DONOR']}>
                  <DonorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute roles={['ROLE_PATIENT']}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

