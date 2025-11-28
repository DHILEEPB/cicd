import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalPatients: 0,
    totalRequests: 0,
    approvedRequests: 0,
    totalBloodUnit: 0
  });
  const [stocks, setStocks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [stocksRes, donorsRes, patientsRes, requestsRes, donationsRes] = await Promise.all([
        axios.get('/api/stock'),
        axios.get('/api/donors'),
        axios.get('/api/patients'),
        axios.get('/api/requests'),
        axios.get('/api/donations')
      ]);

      setStocks(stocksRes.data);
      setDonors(donorsRes.data);
      setPatients(patientsRes.data);
      
      const allRequests = requestsRes.data;
      setPendingRequests(allRequests.filter(r => r.status === 'PENDING'));
      
      const totalUnit = stocksRes.data.reduce((sum, stock) => sum + stock.unit, 0);
      setStats({
        totalDonors: donorsRes.data.length,
        totalPatients: patientsRes.data.length,
        totalRequests: allRequests.length,
        approvedRequests: allRequests.filter(r => r.status === 'APPROVED').length,
        totalBloodUnit: totalUnit
      });

      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(`/api/requests/${id}/approve`);
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await axios.put(`/api/requests/${id}/reject`);
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleApproveDonation = async (id) => {
    try {
      await axios.put(`/api/donations/${id}/approve`);
      loadDashboardData();
    } catch (error) {
      console.error('Error approving donation:', error);
    }
  };

  const handleRejectDonation = async (id) => {
    try {
      await axios.put(`/api/donations/${id}/reject`);
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting donation:', error);
    }
  };

  const handleUpdateStock = async (bloodGroup, unit) => {
    try {
      await axios.put(`/api/stock/${bloodGroup}`, { unit });
      loadDashboardData();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`btn ${activeTab === 'stock' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('stock')}>Blood Stock</button>
          <button className={`btn ${activeTab === 'donors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donors')}>Donors</button>
          <button className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('patients')}>Patients</button>
          <button className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('requests')}>Requests</button>
          <button className={`btn ${activeTab === 'donations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donations')}>Donations</button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Donors</h3>
                <div className="stat-value">{stats.totalDonors}</div>
              </div>
              <div className="stat-card">
                <h3>Total Patients</h3>
                <div className="stat-value">{stats.totalPatients}</div>
              </div>
              <div className="stat-card">
                <h3>Total Requests</h3>
                <div className="stat-value">{stats.totalRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Approved Requests</h3>
                <div className="stat-value">{stats.approvedRequests}</div>
              </div>
              <div className="stat-card">
                <h3>Total Blood Units</h3>
                <div className="stat-value">{stats.totalBloodUnit}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div>
            <h2>Blood Stock Management</h2>
            <div className="blood-group-grid">
              {stocks.map(stock => (
                <div key={stock.id} className="blood-group-card">
                  <h4>{stock.bloodGroup}</h4>
                  <div className="unit">{stock.unit} Units</div>
                  <input
                    type="number"
                    defaultValue={stock.unit}
                    onBlur={(e) => handleUpdateStock(stock.bloodGroup, parseInt(e.target.value))}
                    style={{ marginTop: '10px', padding: '5px', width: '100px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donors' && (
          <div>
            <h2>Donors</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Address</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor.id}>
                    <td>{donor.user?.firstName} {donor.user?.lastName}</td>
                    <td>{donor.bloodGroup}</td>
                    <td>{donor.address}</td>
                    <td>{donor.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            <h2>Patients</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Disease</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.user?.firstName} {patient.user?.lastName}</td>
                    <td>{patient.bloodGroup}</td>
                    <td>{patient.age}</td>
                    <td>{patient.disease}</td>
                    <td>{patient.doctorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2>Pending Blood Requests</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.patientName}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{request.unit}</td>
                    <td>{request.reason}</td>
                    <td>{request.date}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleApproveRequest(request.id)}>
                        Approve
                      </button>
                      <button className="btn btn-danger" onClick={() => handleRejectRequest(request.id)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <h2>Blood Donations</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Disease</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.donor?.user?.firstName} {donation.donor?.user?.lastName}</td>
                    <td>{donation.bloodGroup}</td>
                    <td>{donation.unit}</td>
                    <td>{donation.disease}</td>
                    <td>{donation.status}</td>
                    <td>{donation.date}</td>
                    <td>
                      {donation.status === 'PENDING' && (
                        <>
                          <button className="btn btn-success" onClick={() => handleApproveDonation(donation.id)}>
                            Approve
                          </button>
                          <button className="btn btn-danger" onClick={() => handleRejectDonation(donation.id)}>
                            Reject
                          </button>
                        </>
                      )}
                    </td>
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

export default AdminDashboard;

