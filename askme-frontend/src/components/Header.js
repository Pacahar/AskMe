import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';

import './Header.css'

const Header = ({ isAuth, onLogout }) => { // Получаем isAuth из пропсов
    return (
      <header>
        <nav>
          <Link to="/">Главная</Link>
          {isAuth && (
            <button onClick={() => {
              onLogout(false); // Обновляем состояние в Home
              removeToken(); // Очищаем токен
            }}>
              Выйти
            </button>
          )}
        </nav>
      </header>
    );
  };

export default Header;