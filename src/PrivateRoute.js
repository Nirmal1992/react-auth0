import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import AuthContext from './AuthContext';

function PrivateRoute({ component: Component, scopes, ...rest }) {
  const context = useContext(AuthContext);
  const auth = context.auth;
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.isAuthenticated()) return auth.login();

        if (scopes.length > 0 && !auth.userHasScope(scopes)) {
          console.log(scopes);
          return (
            <h1>
              Ununthorized!! You need the following scopes to view this page:{' '}
              {scopes.join(' ')}
            </h1>
          );
        }
        return <Component {...props} auth={auth} />;
      }}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array
};

PrivateRoute.defaultProps = {
  scopes: []
};

export default PrivateRoute;
