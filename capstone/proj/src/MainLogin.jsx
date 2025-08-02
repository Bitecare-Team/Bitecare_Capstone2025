import { useState } from 'react';
import './LoginForm.css';
import AdminDashboard from './AdminDashboard.jsx';
import StaffDashboard from './StaffDashboard.jsx';
import StaffLogin from './StaffLogin.jsx';

const MainLogin = ({ onLogin, onLogout }) => {
  const [loginType, setLoginType] = useState(null); // 'admin' or 'staff'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setLoginType(null);
    if (onLogout) onLogout();
  };

  const handleAdminLogin = () => {
    setLoginType('admin');
  };

  const handleStaffLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (onLogin) onLogin(type);
  };

  const handleAdminSuccess = () => {
    setIsLoggedIn(true);
    setUserType('admin');
    if (onLogin) onLogin('admin');
  };

  // If logged in, show appropriate dashboard
  if (isLoggedIn) {
    if (userType === 'staff') {
      return <StaffDashboard onLogout={handleLogout} />;
    }
    if (userType === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    }
  }

  // If login type is selected, show appropriate login form
  if (loginType === 'admin') {
    return <DirectAdminLogin onLogin={handleAdminSuccess} onBack={() => setLoginType(null)} />;
  }

  if (loginType === 'staff') {
    return <StaffLogin onLogin={handleStaffLogin} onBack={() => setLoginType(null)} />;
  }

  // Main selection page
  return (
    <div className="da-container">
      <div className="da-login-box" style={{ maxWidth: '500px' }}>
        <div className="da-header">
          <h1>Bitecare System</h1>
          <p>RHU Animal Bite Treatment Center</p>
        </div>

        <div style={{ padding: '40px 20px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: '#1f2937',
            fontSize: '24px'
          }}>
            Choose Login Type
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button
              onClick={handleAdminLogin}
              style={{
                padding: '15px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Admin Login
            </button>

            <button
              onClick={() => setLoginType('staff')}
              style={{
                padding: '15px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              Staff Login
            </button>
          </div>
        </div>

        <div className="da-footer">
          <div className="da-copyright">
            <p>Bitecare System - RHU Animal Bite Treatment Center</p>
            <p>Choose your login type to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modified DirectAdminLogin component to work with the main login
const DirectAdminLogin = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      if (credentials.username && credentials.password) {
        // Admin credentials check
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          onLogin();
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        setError('Please enter both username and password');
      }
    }, 1000);
  };

  return (
    <div className="da-container">
      <div className="da-login-box">
        <div className="da-header">
          <h1>Admin Portal</h1>
          <p>RHU Animal Bite Treatment Center</p>
        </div>

        <form onSubmit={handleSubmit} className="da-form">
          {error && <div className="da-error">{error}</div>}

          <div className="da-form-group">
            <label htmlFor="username">Admin Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter admin username"
            />
          </div>

          <div className="da-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={isLoading} className="da-submit-btn">
            {isLoading ? 'Signing in...' : 'Admin Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Login Selection
          </button>
        </div>

        <div className="da-footer">
          <div className="da-copyright">
            <p>Admin Portal - Bitecare System</p>
            <p>RHU Animal Bite Treatment Center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin; 