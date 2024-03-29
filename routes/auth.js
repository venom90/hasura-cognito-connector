const { AmazonCognitoIdentity, createCognitoUser, userPool } = require('../lib/cognito-user-pool');
const { traceError } = require('../lib/util');
const { cognitoidentityserviceprovider } = require('../lib/cognito-identity-service-provider');


module.exports = app => {
  app.post('/auth/actions/login', (req, res) => {
    try {
      // Destructure username and password from request body
      const { username, password } = req.body.input;

      // Auth data
      const authenticationData = {
        Username: username,
        Password: password
      };

      // Auth details for Cognito
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

      // Cognito User
      const cognitoUser = createCognitoUser(username);

      // Authenticate with auth details
      cognitoUser.authenticateUser(authenticationDetails, {
        // Handle on success event of cognito auth user
        onSuccess: async result => {

          const params = { AccessToken: result.accessToken.jwtToken };
          const userResult = await cognitoidentityserviceprovider.getUser(params).promise();

          // Fetch all attributes
          const attributes = userResult.UserAttributes;
          // Fetch Hasura User id
          const user_id = attributes.find(attribute => attribute.Name === process.env.USER_ID_ATTRIBUTE).Value;

          // Send the response back to client in JSON
          res.send({
            message: '',
            error: false,
            success: true,
            accessToken: result.accessToken.jwtToken,
            refreshToken: result.refreshToken.token,
            idToken: result.idToken,
            user_id
          });
        },

        // Handle on failure event of cognito auth user
        onFailure: err => res.send({ 
          message: err.message,
          error: true,
          success: false,
          accessToken: '',
          refreshToken: '',
          idToken: '',
          user_id: ''
         })
      });
    } catch ({ message }) {
      res.status(500).send({
        message: message,
        error: true,
        success: false,
        accessToken: '',
        refreshToken: '',
        idToken: '',
        user_id: ''
      });
    }
  })
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

      // Cognito User
      const cognitoUser = createCognitoUser(username);

      // Authenticate with auth details
      cognitoUser.authenticateUser(authenticationDetails, {
        // Handle on success event of cognito auth user
        onSuccess: async result => {

          const params = { AccessToken: result.accessToken.jwtToken };
          const userResult = await cognitoidentityserviceprovider.getUser(params).promise();

          // Fetch all attributes
          const attributes = userResult.UserAttributes;
          // Fetch Hasura User id
          const user_id = attributes.find(attribute => attribute.Name === process.env.USER_ID_ATTRIBUTE).Value;

          // Send the response back to client in JSON
          res.send({
            success: true,
            ...result.accessToken.payload,
            accessToken: result.accessToken.jwtToken,
            refreshToken: result.refreshToken.token,
            idToken: result.idToken,
            user_id: user_id
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
      const { email,username, attributes, password, confirmPassword } = req.body;
      const attributeList = [];

      const usr = username ? username : email;

      // check if password and confirm password are same
      if (password !== confirmPassword) return res.json({ error: true, message: 'Password and confirm password don\'t match' });

      // Accept multiple user attributes including custom attributes as configured in Cognito user pool
      for (let i = 0; i < attributes.length; i++) {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: attributes[i].name,
          Value: attributes[i].value
        }));
      }

      // Role with default role attribute
      attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: process.env.USER_ROLE_ATTRIBUTE || 'custom:role',
        Value: process.env.USER_DEFAULT_ROLE || 'subscriber'
      }));

      // UserPool SignUp with username/email and password
      userPool.signUp(usr, password, attributeList, null, (err, data) => {
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
      
      // Cognito User
      const cognitoUser = createCognitoUser(username);

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
      
      // Cognito User
      const cognitoUser = createCognitoUser(username);

      cognitoUser.resendConfirmationCode((err, data) => {
        if (err) {
          traceError(`Error while resending confirmation code (auth.js): ${err.message}`);
          return res.send({ error: true, message: err.message });
        }

        res.send(data);
      });
    } catch (err) {
      res.status(500).send({
        error: true,
        messsage: err.message
      });
    }
  });
}