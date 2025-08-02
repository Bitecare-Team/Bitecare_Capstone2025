import { useState } from 'react';
import './LoginForm.css';

const StaffLogin = ({ onLogin, onBack }) => {
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

    // Simulate staff authentication
    setTimeout(() => {
      setIsLoading(false);
      if (credentials.username && credentials.password) {
        // Staff credentials check
        if (credentials.username === 'staff' && credentials.password === 'staff123') {
          onLogin('staff');
        } else {
          setError('Invalid staff credentials');
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
          <h1>Staff Portal</h1>
          <p>RHU Animal Bite Treatment Center</p>
        </div>

        <form onSubmit={handleSubmit} className="da-form">
          {error && <div className="da-error">{error}</div>}

          <div className="da-form-group">
            <label htmlFor="username">Staff Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter staff username"
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
            {isLoading ? 'Signing in...' : 'Staff Sign in'}
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
            <p>Staff Portal - Bitecare System</p>
            <p>RHU Animal Bite Treatment Center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin; 