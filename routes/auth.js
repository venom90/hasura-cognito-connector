const { userPool, AmazonCognitoIdentity } = require('../lib/cognito-user-pool');
const { traceError } = require('../lib/util');


module.exports = app => {
  /**
   * @description Login user with username and password
   * @method POST
   */
  app.post('/auth/login', (req, res) => {
    try {
      // Destructure username and password from request body
      const { username, password } = req.body;

      // Auth data
      const authenticationData = {
        Username: username,
        Password: password
      };

      // Auth details for Cognito
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

      // Make use of userPool with given username
      const userData = {
        Username: username,
        Pool: userPool
      };

      // new cognitoUser instance
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      // Authenticate with auth details
      cognitoUser.authenticateUser(authenticationDetails, {
        // Handle on success event of cognito auth user
        onSuccess: result => {

          // Hide Identity server path from client
          if (result.accessToken.payload.hasOwnProperty('iss'))
            delete result.accessToken.payload.iss;

          // Send the response back to client in JSON
          res.send({
            ...result.accessToken.payload,
            accessToken: result.accessToken.jwtToken,
            refreshToken: result.refreshToken.token
          });
        },

        // Handle on failure event of cognito auth user
        onFailure: err => res.send({error: true, ...err})
      });
    } catch ({ message }) {
      res.status(500).send({ error: true, message });
    }
  });

  /**
   * SignUp
   * @description SignUp with Cognito User Pool
   * @method POST
   * 
   * attribues in body is an array of objects [{name: 'email', value: john.doe@gmail.com}]
   */
  app.post('/auth/signup', (req, res) => {
    try {
      const { email, attributes, password, confirmPassword } = req.body;
      const attributeList = [];

      // check if password and confirm password are same
      if (password !== confirmPassword) return res.json({ error: true, message: 'Password and confirm password don\'t match' });

      // Accept multiple user attributes including custom attributes as configured in Cognito user pool
      for (let i = 0; i < attributes.length; i++) {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: attributes[i].name,
          Value: attributes[i].value
        }));
      }

      // UserPool SignUp with email and password
      userPool.signUp(email, password, attributeList, null, (err, data) => {
        if (err) {
          traceError(`Cognito SignUp Error (auth.js): ${err.message}`);
          return res.send({ error: true, message: err.message });
        }

        res.send(data.user);
      })
    } catch ({ message }) {
      res.status(500).send({
        error: true,
        message
      });
    }
  });

  /**
   * @description Confirm user registration with code sent in email/mobile
   * @method POST
   */
  app.post('/auth/confirmregistration', (req, res) => {
    try {
      const { code, username } = req.body;
      const userData = {
        Username: username,
        Pool: userPool
      }

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.confirmRegistration(code, true, (err, data) => {
        if (err) {
          traceError(`Error while confirming registration (auth.js): ${err.message}`);
          return res.send({ error: true, message: err.message });
        }

        res.send(data);
      });
    } catch ({ message }) {
      res.status(500).send({
        error: true,
        messsage
      });
    }
  });

  /**
   * @description Resend Confirmation code
   * @method POST
   */
  app.post('/auth/resendconfirmationcode', (req, res) => {
    try {
      const { username } = req.body;
      const userData = {
        Username: username,
        Pool: userPool
      }

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.resendConfirmationCode((err, data) => {
        if (err) {
          traceError(`Error while resending confirmation code (auth.js): ${err.message}`);
          return res.send({ error: true, message: err.message });
        }

        res.send(data);
      });
    } catch ({ message }) {
      res.status(500).send({
        error: true,
        messsage
      });
    }
  });
}