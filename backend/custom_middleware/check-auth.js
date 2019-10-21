const jsonwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jsonwt.verify(token, 'secret_that_should-be_longer'); // If its throw an error the next middleware wont be called.
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }

}
