import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    approvedDonations: 0,
    totalRequests: 0,
    approvedRequests: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donationForm, setDonationForm] = useState({
    disease: 'Nothing',
    age: '',
    bloodGroup: '',
    unit: ''
  });
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    patientAge: '',
    reason: '',
    bloodGroup: '',
    unit: ''
  });

  useEffect(() => {
    loadDonorData();
  }, [user]);

  const loadDonorData = async () => {
    try {
      const donorRes = await axios.get(`/api/donors/user/${user.id}`);
      setDonor(donorRes.data);

      const [donationsRes, requestsRes] = await Promise.all([
        axios.get(`/api/donations/donor/${user.id}`),
        axios.get(`/api/requests/donor/${user.id}`)
      ]);

      setDonations(donationsRes.data);
      setRequests(requestsRes.data);

      setStats({
        totalDonations: donationsRes.data.length,
        approvedDonations: donationsRes.data.filter(d => d.status === 'APPROVED').length,
        totalRequests: requestsRes.data.length,
        approvedRequests: requestsRes.data.filter(r => r.status === 'APPROVED').length
      });
    } catch (error) {
      console.error('Error loading donor data:', error);
    }
  };

  const handleDonateBlood = async (e) => {
    e.preventDefault();
    try {
      const donationData = {
        ...donationForm,
        age: parseInt(donationForm.age),
        unit: parseInt(donationForm.unit),
        donor: { id: donor.id }
      };
      await axios.post('/api/donations', donationData);
      setDonationForm({ disease: 'Nothing', age: '', bloodGroup: '', unit: '' });
      loadDonorData();
      alert('Donation request submitted successfully!');
    } catch (error) {
      alert('Failed to submit donation request');
    }
  };

  const handleRequestBlood = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...requestForm,
        patientAge: parseInt(requestForm.patientAge),
        unit: parseInt(requestForm.unit),
        donor: { id: donor.id }
      };
      await axios.post('/api/requests', requestData);
      setRequestForm({ patientName: '', patientAge: '', reason: '', bloodGroup: '', unit: '' });
      loadDonorData();
      alert('Blood request submitted successfully!');
    } catch (error) {
      alert('Failed to submit blood request');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Donor Dashboard</h1>
          {donor && <p>Welcome, {user.firstName} {user.lastName}</p>}
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`btn ${activeTab === 'donate' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donate')}>Donate Blood</button>
          <button className={`btn ${activeTab === 'request' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('request')}>Request Blood</button>
          <button className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}>History</button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Donations</h3>
                <div className="stat-value">{stats.totalDonations}</div>
              </div>
              <div className="stat-card">
                <h3>Approved Donations</h3>
                <div className="stat-value">{stats.approvedDonations}</div>
              </div>
              <div className="stat-card">
                <h3>Total Requests</h3>
                <div className="stat-value">{stats.totalRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Approved Requests</h3>
                <div className="stat-value">{stats.approvedRequests}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="card">
            <h2>Donate Blood</h2>
            <form onSubmit={handleDonateBlood}>
              <div className="form-group">
                <label>Disease (if any)</label>
                <input
                  type="text"
                  value={donationForm.disease}
                  onChange={(e) => setDonationForm({...donationForm, disease: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={donationForm.age}
                  onChange={(e) => setDonationForm({...donationForm, age: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={donationForm.bloodGroup}
                  onChange={(e) => setDonationForm({...donationForm, bloodGroup: e.target.value})}
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
                  value={donationForm.unit}
                  onChange={(e) => setDonationForm({...donationForm, unit: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Donation</button>
              </div>
            </form>
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
            <h2>Donation History</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Disease</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.bloodGroup}</td>
                    <td>{donation.unit}</td>
                    <td>{donation.disease}</td>
                    <td>{donation.status}</td>
                    <td>{donation.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={{ marginTop: '40px' }}>Request History</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Blood Group</th>
                  <th>Units</th>
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

export default DonorDashboard;

