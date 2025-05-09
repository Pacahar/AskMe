import React, { useState } from 'react';
import { API_URL } from '../../config.js';

const RegisterForm = ({ onChangeForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        
      const response = await fetch(API_URL + '/auth/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username,
          email,
          password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).join('\n');
        throw new Error(errorMessage || 'Registration failed');
      }

      onChangeForm(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Registration</h2>
      
      {error && <div style={{ color: 'red', whiteSpace: 'pre-line' }}>{error}</div>}
      
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <button type="submit" disabled={isLoading || !username || !email || !password} >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      
      <a onClick={() => onChangeForm(true)}>Уже есть аккаунт?</a>
    </form>
  );
};

export default RegisterForm;