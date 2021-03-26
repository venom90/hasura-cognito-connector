const { userPool, AmazonCognitoIdentity } = require('../lib/cognito-user-pool');
const { traceError } = require('../lib/util');

module.exports = app => {
  /**
   * @description Change user password
   * @method POST
   */
  app.post('/auth/changepassword', (req, res) => {
    try {
      const { username, oldPassword, newPassword, confirmPassword } = req.body;

      // check if password and confirm password are same
      if (newPassword !== confirmPassword) return res.json({ error: true, message: 'New password and confirm password don\'t match' });

      // Make use of userPool with given username
      const userData = {
        Username: username,
        Pool: userPool
      };

      // new cognitoUser instance
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      // Change password of cognito user
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          traceError(`Error while changing user password (password.js) ${err.message}`);
          res.send({ error: true, ...err });
          return;
        }

        res.send({ success: true, ...result });
      });
    } catch ({ message }) {
      res.status(500).send({ error: true, message });
    }
  });
};