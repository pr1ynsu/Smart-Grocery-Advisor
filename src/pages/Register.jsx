import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [registered, setRegistered] = useState(false);

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
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Age" onChange={e => setAge(e.target.value)} required />
      <input type="number" placeholder="Height (cm)" onChange={e => setHeight(e.target.value)} required />
      <input type="number" placeholder="Weight (kg)" onChange={e => setWeight(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>

      {registered && (
        <div style={{ marginTop: "10px" }}>
          <p>✅ Registered successfully!</p>
          <Link to="/login">
            <button>Go to Login</button>
          </Link>
        </div>
      )}
    </form>
  );
}

export default Register;
