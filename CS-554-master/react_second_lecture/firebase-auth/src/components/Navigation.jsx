import {NavLink} from 'react-router-dom';
import './App.css';

function Navigation() {
  return (
    <nav className='navigation'>
      <ul>
        <li>
          <NavLink
            to='/'
            className={(navData) => (navData.isActive ? 'active' : 'none')}
          >
            Landing
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/home'
            className={(navData) => (navData.isActive ? 'active' : 'none')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account'
            className={(navData) => (navData.isActive ? 'active' : 'none')}
          >
            Account
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/signin'
            className={(navData) => (navData.isActive ? 'active' : 'none')}
          >
            Sign-In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
