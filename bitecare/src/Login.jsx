import React, { useState } from 'react';
import './Login.css'; // Custom styles

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-left d-none d-md-flex align-items-center justify-content-center text-white text-center">
        <div className="px-4">
          <h1 className="fw-bold mb-3">Advanture start here</h1>
          <p>Create an account to Join Our Community</p>
        </div>
      </div>
      <div className="login-right d-flex align-items-center justify-content-center">
        <div className="login-form-wrapper p-4 p-md-5 shadow-sm bg-white rounded-4 w-100" style={{ maxWidth: '400px' }}>
          <div className="text-center mb-4">
            <img src="https://via.placeholder.com/50" alt="logo" className="mb-3" />
            <h5>Hello! Welcome back</h5>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="text-decoration-none text-primary small">Reset Password?</a>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
          </form>

          <div className="text-center text-muted mb-3">or</div>

          <div className="d-flex justify-content-center gap-3 mb-3">
            <button className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-google"></i></button>
            <button className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-facebook"></i></button>
            <button className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-github"></i></button>
          </div>

          <div className="text-center small">
            Don’t have an account? <a href="#" className="text-decoration-none text-primary">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
