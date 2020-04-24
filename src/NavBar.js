import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ auth: { login, logout, isAuthenticated, userHasScope } }) => {
  return (
    <nav>
      <ul className='ulc'>
        <li className='lic'>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
        <li>
          <Link to='/public'>Public</Link>
        </li>
        {isAuthenticated() && (
          <li>
            <Link to='/private'>Private</Link>
          </li>
        )}
        {isAuthenticated() && (
          <li>
            <Link to='/admin'>Admin</Link>
          </li>
        )}
        {isAuthenticated() && userHasScope(['read:courses']) && (
          <li>
            <Link to='/courses'>Courses</Link>
          </li>
        )}
        <li>
          {
            <button onClick={isAuthenticated() ? logout : login}>
              {isAuthenticated() ? 'Logout' : 'Login'}
            </button>
          }
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
