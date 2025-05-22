import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

      await setDoc(doc(db, 'users', user.uid), {
        name,
        age,
        height,
        weight,
        bmi,
        email
      });

      setRegistered(true);
      navigate('/login');
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay">
        <div className="login-container">
          <div className="login-left">
            <h1>Join Us</h1>
            <p>Smart Wellness, Personalized.</p>
            <p>
              Track your health, get real-time insights, and receive grocery recommendations
              that align with your BMI and goals.
            </p>
          </div>

          <div className="login-right">
            <div className="glass-box">
              <form onSubmit={handleRegister}>
                <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>Register</h2>
                <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required />
                <input type="number" placeholder="Age" onChange={e => setAge(e.target.value)} required />
                <input type="number" placeholder="Height (cm)" onChange={e => setHeight(e.target.value)} required />
                <input type="number" placeholder="Weight (kg)" onChange={e => setWeight(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>

                <p className="bmi-note">
                  💡 <strong>BMI</strong> (Body Mass Index) helps track your health:
                  <br />
                  ▸ Underweight: &lt; 18.5 &nbsp; ▸ Normal: 18.5–24.9
                  <br />
                  ▸ Overweight: 25–29.9 &nbsp; ▸ Obese: 30+
                </p>
                <p style={{ marginTop: '10px', textAlign: 'center' }}>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
