import * as jwt from 'jsonwebtoken';

class AuthService {
  generateToken(user) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const signature = process.env.jwt_signature;
    const expiration = process.env.jwt_expiration;

    return jwt.default.sign({data}, signature, {expiresIn: expiration});
  }
}

export default new AuthService();
