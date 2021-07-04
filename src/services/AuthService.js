const jwt = require('jsonwebtoken');

class AuthService {
  generateToken(user) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const signature = process.env.jwt_signature;
    const expiration = process.env.jwt_expiration;

    return jwt.sign({data}, signature, {expiresIn: expiration});
  }

  // We are assuming that the JWT will come in the header Authorization but it could come in the req.body or in a query param, you have to decide what works best for you.
  getTokenFromHeader = req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
  };
}

module.exports = new AuthService();
