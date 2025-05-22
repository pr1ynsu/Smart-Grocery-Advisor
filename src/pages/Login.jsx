import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError("Login failed. Please register if you don't have an account.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay">
        <div className="login-container">
          <div className="login-left">
            <h1>Welcome!</h1>
            <p>Your Smart Grocery Advisor</p>
            <p>
              Get nutritional suggestions and smart picks based on your BMI.
              Track calories and eat smart!
            </p>
          </div>

          <div className="login-right">
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              {error && <p className="error">{error}</p>}
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
