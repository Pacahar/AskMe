import React, { useState } from 'react';

import { API_URL } from '../../config.js';
import { saveToken} from '../../utils/auth.js'

const LoginForm = ({onLogin, onChangeForm}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL + '/auth/jwt/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Authorization failed');
      }

      const { access, refresh } = await response.json();
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      saveToken(access);
      onLogin(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <div>
        <label>
          Password:
          <input type="password" value={password}  onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <button type="submit" disabled={isLoading || !username || !password} >
        {isLoading ? 'Авторизация...' : 'Войти'}
      </button>
      <a onClick={() => {onChangeForm(false);}}>Еще нет аккаунта?</a>
    </form>
  );
};

export default LoginForm;