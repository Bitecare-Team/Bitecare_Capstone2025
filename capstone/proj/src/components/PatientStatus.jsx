import React from 'react';

const PatientStatus = () => {
  return (
    <div className="content-section">
      <h2>Patient Status</h2>
      
      {/* Status Overview Cards */}
      <div className="content-grid">
        <div className="card">
          <h3>Active Patients</h3>
          <p>89 patients currently active</p>
          <button className="btn-primary">View Details</button>
        </div>
        <div className="card">
          <h3>Completed Treatment</h3>
          <p>156 patients completed</p>
          <button className="btn-secondary">View Records</button>
        </div>
        <div className="card">
          <h3>Pending Follow-up</h3>
          <p>23 patients need follow-up</p>
          <button className="btn-primary">Schedule</button>
        </div>
        <div className="card">
          <h3>Emergency Cases</h3>
          <p>5 urgent cases</p>
          <button className="btn-warning">Respond</button>
        </div>
      </div>
      
      {/* Status Table */}
      <div className="table-container">
        <table className="status-table">
          <thead>
            <tr>
              <th>
                <span className="sort-icon">◆</span>
                Patient Name
              </th>
              <th>
                <span className="sort-icon">◆</span>
                Treatment Phase
              </th>
              <th>
                <span className="sort-icon">◆</span>
                Last Visit
              </th>
              <th>
                <span className="sort-icon">◆</span>
                Next Appointment
              </th>
              <th>
                <span className="sort-icon">◆</span>
                Status
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Dela Cruz</td>
              <td>1st Dose</td>
              <td>2024-01-15</td>
              <td>2024-01-22</td>
              <td><span className="status-active">Active</span></td>
              <td>
                <button className="action-btn view-btn">View</button>
                <button className="action-btn schedule-btn">Schedule</button>
              </td>
            </tr>
            <tr>
              <td>Maria Santos</td>
              <td>2nd Dose</td>
              <td>2024-01-10</td>
              <td>2024-01-17</td>
              <td><span className="status-active">Active</span></td>
              <td>
                <button className="action-btn view-btn">View</button>
                <button className="action-btn schedule-btn">Schedule</button>
              </td>
            </tr>
            <tr>
              <td>Pedro Reyes</td>
              <td>Completed</td>
              <td>2024-01-08</td>
              <td>-</td>
              <td><span className="status-completed">Completed</span></td>
              <td>
                <button className="action-btn view-btn">View</button>
                <button className="action-btn discharge-btn">Discharge</button>
              </td>
            </tr>
            <tr>
              <td>Ana Garcia</td>
              <td>3rd Dose</td>
              <td>2024-01-12</td>
              <td>2024-01-19</td>
              <td><span className="status-active">Active</span></td>
              <td>
                <button className="action-btn view-btn">View</button>
                <button className="action-btn schedule-btn">Schedule</button>
              </td>
            </tr>
            <tr>
              <td>Luis Martinez</td>
              <td>Follow-up</td>
              <td>2024-01-05</td>
              <td>2024-01-20</td>
              <td><span className="status-pending">Pending</span></td>
              <td>
                <button className="action-btn view-btn">View</button>
                <button className="action-btn schedule-btn">Schedule</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn">Previous</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  );
};

export default PatientStatus; 