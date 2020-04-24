import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Profile from './Profile';
import Home from './Home';
import NavBar from './NavBar';
import Auth from './Auth/Auth';
import Callback from './Callback';
import Public from './Public';
import Private from './Private';
import Courses from './Courses';
import Admin from './Admin';
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewalComplete: false
    };
  }

  componentDidMount() {
    this.state.auth.renewToken(() => {
      this.setState({ tokenRenewalComplete: true });
    });
  }

  render() {
    const { auth, tokenRenewalComplete } = this.state;
    if (!tokenRenewalComplete) return 'Loading...';
    return (
      <AuthContext.Provider value={{ auth }}>
        <NavBar auth={auth} />
        <div className='container'>
          <Route
            path='/'
            render={(props) => <Home auth={auth} {...props} />}
            exact
          />
          <Route
            path='/callback'
            render={(props) => <Callback auth={auth} {...props} />}
          />
          <Route path='/public' component={Public} />
          <PrivateRoute path='/private' component={Private} />
          <PrivateRoute path='/admin' component={Admin} />
          <PrivateRoute
            path='/courses'
            component={Courses}
            scopes={['read:courses']}
          />
          <PrivateRoute path='/profile' component={Profile} auth={auth} />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
