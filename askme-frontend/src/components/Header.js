import { Link } from 'react-router-dom';
import { removeRefreshToken, removeToken } from '../utils/auth';

import './Header.css'

const Header = ({ isAuth, onLogout }) => {
    return (
      <header>
        <nav>
          <Link to="/">AskMe</Link>
          <p style={{color: 'white'}}>Соколовский ИКБО-30-22</p>
          {isAuth && (<button onClick={() => {onLogout(false); removeToken(); removeRefreshToken(); }}>Выйти</button>)}
        </nav>
      </header>
    );
  };

export default Header;