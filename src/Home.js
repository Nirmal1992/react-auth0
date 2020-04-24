import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    const {
      auth: { login, isAuthenticated }
    } = this.props;
    return (
      <div>
        <h1 className='heading'>Home</h1>
        {isAuthenticated() ? (
          <Link to='/profile'>Profile</Link>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    );
  }
}

export default Home;
