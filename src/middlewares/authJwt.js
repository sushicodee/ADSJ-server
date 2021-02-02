const expressJwt = require('express-jwt');
const { JWT_SECRET, API } = require('../configs');

function authJwt() {
  const secret = JWT_SECRET;
  const api = API;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/blog(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/auth/login`,
      `${api}/auth/register`,
      `${api}/auth/forgot`,
      `${api}/auth/googleLogin`,
      `${api}/auth/activation`,
      `${api}/auth/facebookLogin`,
      `${api}/auth/password/passwordForgot`,
      `${api}/auth/password/reset`,
      `${api}/auth/renew`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.role === 'admin') {
    done(null, true);
  }
  if (payload) {
    req.user = payload;
  }
  done();
}
module.exports = authJwt;
