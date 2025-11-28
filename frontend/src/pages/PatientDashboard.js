import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    patientAge: '',
    reason: '',
    bloodGroup: '',
    unit: ''
  });

  useEffect(() => {
    loadPatientData();
  }, [user]);

  const loadPatientData = async () => {
    try {
      const patientRes = await axios.get(`/api/patients/user/${user.id}`);
      setPatient(patientRes.data);

      const requestsRes = await axios.get(`/api/requests/patient/${user.id}`);
      setRequests(requestsRes.data);

      setStats({
        totalRequests: requestsRes.data.length,
        approvedRequests: requestsRes.data.filter(r => r.status === 'APPROVED').length,
        pendingRequests: requestsRes.data.filter(r => r.status === 'PENDING').length,
        rejectedRequests: requestsRes.data.filter(r => r.status === 'REJECTED').length
      });
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleRequestBlood = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...requestForm,
        patientAge: parseInt(requestForm.patientAge),
        unit: parseInt(requestForm.unit),
        patient: { id: patient.id }
      };
      await axios.post('/api/requests', requestData);
      setRequestForm({ patientName: '', patientAge: '', reason: '', bloodGroup: '', unit: '' });
      loadPatientData();
      alert('Blood request submitted successfully!');
    } catch (error) {
      alert('Failed to submit blood request');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Patient Dashboard</h1>
          {patient && <p>Welcome, {user.firstName} {user.lastName}</p>}
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`btn ${activeTab === 'request' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('request')}>Request Blood</button>
          <button className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}>My Requests</button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Requests</h3>
                <div className="stat-value">{stats.totalRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Approved</h3>
                <div className="stat-value">{stats.approvedRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <div className="stat-value">{stats.pendingRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Rejected</h3>
                <div className="stat-value">{stats.rejectedRequests}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="card">
            <h2>Request Blood</h2>
            <form onSubmit={handleRequestBlood}>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  value={requestForm.patientName}
                  onChange={(e) => setRequestForm({...requestForm, patientName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Patient Age</label>
                <input
                  type="number"
                  value={requestForm.patientAge}
                  onChange={(e) => setRequestForm({...requestForm, patientAge: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={requestForm.bloodGroup}
                  onChange={(e) => setRequestForm({...requestForm, bloodGroup: e.target.value})}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Units</label>
                <input
                  type="number"
                  value={requestForm.unit}
                  onChange={(e) => setRequestForm({...requestForm, unit: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2>My Blood Requests</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{request.patientName}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{request.unit}</td>
                    <td>{request.reason}</td>
                    <td>{request.status}</td>
                    <td>{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

