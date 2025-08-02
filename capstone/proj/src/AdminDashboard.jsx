import { useState } from 'react';
import './AdminDashboard.css';
import Dashboard from './components/Dashboard.jsx';
import AppointmentList from './components/AppointmentList.jsx';
import PatientList from './components/PatientList.jsx';
import PatientPayments from './components/PatientPayments.jsx';
import PatientStatus from './components/PatientStatus.jsx';
import Staff from './components/Staff.jsx';
import Schedule from './components/Schedule.jsx';
import VaccineManagement from './components/VaccineManagement.jsx';
import AnalyticsReports from './components/AnalyticsReports.jsx';
import Map from './components/Map.jsx';
import { FaTachometerAlt, FaCalendarCheck, FaUsers, FaMoneyBill, FaUser, FaUserMd, FaCalendarAlt, FaSyringe, FaChartBar, FaMapMarkedAlt } from 'react-icons/fa';
import logoImage from './assets/logo1.png';

const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('patient-payments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'appointment-list', label: 'Appointment List', icon: <FaCalendarCheck /> },
    { id: 'patient-list', label: 'Patient History', icon: <FaUsers /> },
    { id: 'patient-payments', label: 'Patient Payments', icon: <FaMoneyBill /> },
    { id: 'staff', label: 'Staff', icon: <FaUserMd /> },
    { id: 'schedule', label: 'Schedule', icon: <FaCalendarAlt /> },
    { id: 'vaccine-management', label: 'Vaccine Management', icon: <FaSyringe /> },
    { id: 'analytics-reports', label: 'Analytics Reports', icon: <FaChartBar /> },
    { id: 'map', label: 'Map', icon: <FaMapMarkedAlt /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointment-list':
        return <AppointmentList />;
      case 'patient-list':
        return <PatientList />;
      case 'patient-payments':
        return <PatientPayments />;
      case 'staff':
        return <Staff />;
      case 'schedule':
        return <Schedule />;
      case 'vaccine-management':
        return <VaccineManagement />;
      case 'analytics-reports':
        return <AnalyticsReports />;
      case 'map':
        return <Map />;
      default:
        return <Dashboard />;
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
          <h1>Welcome to RHU Animal Bite Treatment Center - Admin Panel</h1>
          <div className="header-actions">
           
            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">Ryan Azhari</div>
                <div className="user-role">Admin</div>
              </div>
              <div className="user-avatar">R</div>
              <span className="user-dropdown">▼</span>
            </div>
            <div className="header-icons">
              <div className="header-icon notification-icon">
                <span>🔔</span>
                <div className="notification-badge"></div>
              </div>
              <div className="header-icon">
              <small>Last login: Today</small>
              </div>
            </div>
          </div>
        </header>
        <main className="content-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 