import { useState } from 'react';
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
      <h2>Регистрация</h2>
      
      {error && <div style={{ color: 'red', whiteSpace: 'pre-line' }}>{error}</div>}
      
      <div>
        <label>
          Имя пользователя:
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
          Почта:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <div>
        <label>
          Пароль:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
        </label>
      </div>

      <button type="submit" disabled={isLoading || !username || !email || !password} >{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
      <button type="button" className="link-button"onClick={() => onChangeForm(true)}>Уже есть аккаунт?</button>
    </form>
  );
};

export default RegisterForm;