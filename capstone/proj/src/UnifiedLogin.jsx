import { useState } from 'react';
import './LoginForm.css';

const UnifiedLogin = ({ onLogin }) => {
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
        // Check admin credentials
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          onLogin('admin');
        }
        // Check staff credentials
        else if (credentials.username === 'staff' && credentials.password === 'staff123') {
          onLogin('staff');
        }
        // Check for other staff members
        else if (credentials.username === 'maria' && credentials.password === 'maria123') {
          onLogin('staff');
        }
        else if (credentials.username === 'juan' && credentials.password === 'juan123') {
          onLogin('staff');
        }
        else {
          setError('Invalid username or password');
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
          <h1>Bitecare System</h1>
          <p>RHU Animal Bite Treatment Center</p>
        </div>

        <form onSubmit={handleSubmit} className="da-form">
          {error && <div className="da-error">{error}</div>}

          <div className="da-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>Demo Credentials:</p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            <strong>Admin:</strong> admin / admin123
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            <strong>Staff:</strong> staff / staff123
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            <strong>Staff:</strong> maria / maria123
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            <strong>Staff:</strong> juan / juan123
          </p>
        </div>

        <div className="da-footer">
          <div className="da-copyright">
            <p>Bitecare System - RHU Animal Bite Treatment Center</p>
            <p>Enter your credentials to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin; 