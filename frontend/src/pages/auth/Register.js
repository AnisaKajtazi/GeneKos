import React, { useState, useContext } from 'react';
import { register as apiRegister } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    gender: 'other',
    date_of_birth: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiRegister(form);
      alert("Registration successful! Please log in.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>
        <button type="submit">Register</button>
      </form>
            <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate('/login')}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Register;
