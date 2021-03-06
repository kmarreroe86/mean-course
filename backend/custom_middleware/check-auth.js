const jsonwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwt.verify(token, process.env.JWT_KEY); // If its throw an error the next middleware wont be called.
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed(jwt)'
    });
  }

}
