import React from 'react';

const VaccineManagement = () => {
  return (
    <div className="content-section">
      <h2>Vaccine Management</h2>
      
      {/* Overview Cards */}
      <div className="content-row">
        <div className="card">
          <h3>Total Vaccines</h3>
          <p>1,250 doses available</p>
          <button className="btn-primary">View Inventory</button>
        </div>
        <div className="card">
          <h3>Low Stock Alert</h3>
          <p>3 vaccines need restocking</p>
          <button className="btn-warning">Restock Now</button>
        </div>
        <div className="card">
          <h3>Expiring Soon</h3>
          <p>45 doses expire this month</p>
          <button className="btn-secondary">Check Details</button>
        </div>
        {/* <div className="card">
          <h3>Vaccinations Today</h3>
          <p>28 vaccinations scheduled</p>
          <button className="btn-primary">View Schedule</button>
        </div> */}
      </div>

      {/* Vaccine Inventory Table */}
      <div className="table-section">
        <h3>Vaccine Inventory</h3>
        <div className="controls-section">
          <div className="search-control">
            <label>Search vaccines: </label>
            <input
              type="text"
              className="search-input"
              placeholder="Enter vaccine name or batch number..."
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status</label>
              <select className="filter-select">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="low-stock">Low Stock</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <button className="add-new-btn">Add New Vaccine</button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="vaccine-table">
            <thead>
              <tr>
                <th><span className="sort-icon">◆</span>Vaccine Name</th>
                <th><span className="sort-icon">◆</span>Quantity</th>
                <th><span className="sort-icon">◆</span>Expiry Date</th>
                <th><span className="sort-icon">◆</span>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SPEEDA</td>
                <td>150 doses</td>
                <td>2024-12-15</td>
                <td><span className="status-active">Available</span></td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button className="action-btn edit-btn">Edit</button>
                </td>
              </tr>
              <tr>
                <td>VAXIRAB</td>
                <td>25 doses</td>
                <td>2024-11-30</td>
                <td><span className="status-warning">Low Stock</span></td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button className="action-btn edit-btn">Edit</button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>

      {/* Vaccination Records */}
      {/* <div className="table-section">
        <h3>Recent Vaccination Records</h3>
        <div className="table-container">
          <table className="vaccination-records-table">
            <thead>
              <tr>
                <th><span className="sort-icon">◆</span>Patient Name</th>
                <th><span className="sort-icon">◆</span>Vaccine Type</th>
                <th><span className="sort-icon">◆</span>Dose Number</th>
                <th><span className="sort-icon">◆</span>Date Administered</th>
                <th><span className="sort-icon">◆</span>Next Dose Date</th>
                <th><span className="sort-icon">◆</span>Administered By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Juan Dela Cruz</td>
                <td>Anti-Rabies Vaccine</td>
                <td>1st Dose</td>
                <td>2024-01-15</td>
                <td>2024-01-22</td>
                <td>Dr. Santos</td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button className="action-btn edit-btn">Edit</button>
                </td>
              </tr>
              <tr>
                <td>Maria Santos</td>
                <td>Anti-Rabies Vaccine</td>
                <td>2nd Dose</td>
                <td>2024-01-14</td>
                <td>2024-01-28</td>
                <td>Dr. Garcia</td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button className="action-btn edit-btn">Edit</button>
                </td>
              </tr>
              <tr>
                <td>Pedro Garcia</td>
                <td>Tetanus Vaccine</td>
                <td>1st Dose</td>
                <td>2024-01-13</td>
                <td>2024-02-13</td>
                <td>Dr. Lopez</td>
                <td>
                  <button className="action-btn view-btn">View</button>
                  <button className="action-btn edit-btn">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default VaccineManagement; 