const { createCognitoUser, userPool } = require('../lib/cognito-user-pool');
const { traceError } = require('../lib/util');

module.exports = app => {
  /**
   * @description Change user password
   * @method POST
   */
  app.post('/user/change-password', (req, res) => {
    try {
      const { username, oldPassword, newPassword, confirmPassword } = req.body;

      // check if password and confirm password are same
      if (newPassword !== confirmPassword) return res.json({ error: true, message: 'New password and confirm password don\'t match' });

      // Cognito User
      const cognitoUser = userPool.getCurrentUser();

      // Change password of cognito user
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          traceError(`Error while changing user password (password.js) ${err.message}`);
          res.send({ error: true, message: err.message });
          return;
        }

        res.send({ success: true, ...result });
      });
    } catch ({ message }) {
      res.status(500).send({ error: true, message });
    }
  });

  /**
   * @description Forgot Password
   * @method POST
   */
  app.post('/user/forgot-password', (req, res) => {
    try {
      const cognitoUser = createCognitoUser(req.body.username);

      cognitoUser.forgotPassword({
        onSuccess: data => {
          // successfully initiated reset password request
          res.send({ success: true, ...data });
        },
        onFailure: err => res.send({ error: true, ...err })
      });
    } catch ({ message }) {
      res.status(500).send({ error: true, message });
    }
  });

  /**
   * @description Confirm password
   * @method POST
   */
  app.post('/user/confirm-password', (req, res) => {
    try {
      const { username, newPassword, verificationCode } = req.body;
      const cognitoUser = createCognitoUser(username);
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess() {
          res.send({success: true, message: 'Password Confirmed!'});
        },
        onFailure(err) {
          res.send({error: true, message: 'Password not confirmed!'});
        }
      });
    } catch ({ message }) {
      res.status(500).send({ error: true, message });
    }
  });
};
