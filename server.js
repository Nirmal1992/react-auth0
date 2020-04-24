const express = require('express');
require('dotenv').config();
const jwt = require('express-jwt'); // Validate JWT and set req.user
const jwksRsa = require('jwks-rsa'); //Retreive RSA key from JSON Web Key Set(JWKS) endpoint
const checkScope = require('express-jwt-authz'); //Check the scope of request

var jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const app = express();

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from public api!!'
  });
});

app.get('/private', jwtCheck, (req, res) => {
  res.json({
    message: 'Hello from private api!!'
  });
});

function checkRole(role) {
  return function (req, res, next) {
    const assignedRole = req.user['http://localhost:3000/roles'];
    if (Array.isArray(assignedRole) && assignedRole.includes(role)) {
      return next();
    }
    return res.status(401).json({ message: 'Insufficient role' });
  };
}

app.get('/admin', jwtCheck, checkRole('admin'), (req, res) => {
  res.json({
    message: 'Hello to admin page!!'
  });
});

app.get('/course', jwtCheck, checkScope(['read:courses']), (req, res) => {
  res.json({
    courses: [
      {
        id: 1,
        title: 'Hello World'
      },
      {
        id: 2,
        title: 'Dil Wale Dulhaniya Le Jayege'
      }
    ]
  });
});

app.listen(3001);
console.log('Server listening on ', process.env.REACT_APP_AUTH0_AUDIENCE);
