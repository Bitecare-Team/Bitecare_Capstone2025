import { useState } from 'react';
import { FaTachometerAlt, FaCalendarCheck, FaUsers, FaMoneyBill, FaUser, FaUserMd, FaCalendarAlt, FaSyringe, FaChartBar, FaMapMarkedAlt } from 'react-icons/fa';
import logoImage from './assets/logo1.png';
import './AdminDashboard.css';

const StaffDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'appointment-list', label: 'Appointment List', icon: <FaCalendarCheck /> },
    { id: 'patient-status', label: 'Patient List', icon: <FaUser /> },
    { id: 'patient-list', label: 'Patient History', icon: <FaUsers /> },
    { id: 'patient-payments', label: 'Patient Payments', icon: <FaMoneyBill /> },
    
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="content-section">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              margin: '20px'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Staff Dashboard Overview
              </h2>
              
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <h3>Welcome, Maria Santos!</h3>
                <p>Staff Dashboard - Manage your daily tasks and patient appointments.</p>
                <p>Quick access to patient records, appointment scheduling, and treatment updates.</p>
              </div>
            </div>
          </div>
        );
      case 'patient-list':
        return (
          <div className="content-section">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              margin: '20px'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Patient List - Staff View
              </h2>
              
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <h3>Patient List for Staff</h3>
                <p>This is where staff members can view and manage patient information.</p>
                <p>Staff members can access patient records, update status, and manage appointments.</p>
              </div>
            </div>
          </div>
        );
      case 'patient-payments':
        return (
          <div className="content-section">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              margin: '20px'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Patient Payment Management - Staff View
              </h2>
              
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <h3>Patient Payment Management</h3>
                <p>Staff members can process patient payments, view payment history, and manage billing records.</p>
                <p>Track payment status, generate receipts, and handle payment inquiries.</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              margin: '20px'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Staff Portal - {activeSection.replace('-', ' ').toUpperCase()}
              </h2>
              
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <h3>Staff Section</h3>
                <p>This section is under development for staff members.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img 
              src={logoImage}
              alt="BOGO CITY HEALTH OFFICE CEBU"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                marginRight: '15px'
              }}
            />
            <h2>Bitecare</h2>
          </div>
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="content-header">
          <h1>Staff Portal - RHU Animal Bite Treatment Center</h1>
          <div className="header-actions">
            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">Maria Santos</div>
                <div className="user-role">Staff</div>
              </div>
              <div className="user-avatar">M</div>
              <span className="user-dropdown">▼</span>
            </div>
            <div className="header-icons">
              <div className="notification-icon">
                <span>🔔</span>
                <div className="notification-badge">2</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Main */}
        <div className="content-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 