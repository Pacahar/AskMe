import { Link } from 'react-router-dom';
import { removeRefreshToken, removeToken } from '../utils/auth';

import './Header.css'

const Header = ({ isAuth, onLogout }) => {
    return (
      <header>
        <nav>
          <Link to="/">AskMe</Link>
          {isAuth && (<button onClick={() => {onLogout(false); removeToken(); removeRefreshToken(); }}>Выйти</button>)}
        </nav>
      </header>
    );
  };

export default Header;