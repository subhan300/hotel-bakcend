'use strict';
const jwt = require('jsonwebtoken');
const user = require('../models/users');

const ensureUserAuth = async function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'The request does not have the authentication header' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, 'hotel123');
    const { _id } = decodedToken.result;
    await user.findById(_id)
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(403).send({ message: 'Unauthorized request' });
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).send({ message: 'user not authorized' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'invalid token' });
  }
};


module.exports = { ensureUserAuth};
