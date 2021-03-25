const { userPool, AmazonCognitoIdentity } = require('../lib/cognito-user-pool');
const { showError, traceError } = require('../lib/util');

module.exports = app => {
  app.post('/auth/login', (req, res) => {
    res.send('Hello root');
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
        new AmazonCognitoIdentity
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
    } catch({message}) {
      res.send({
        error: true,
        messsage
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
          return res.send({error: true, message: err.message});
        }
  
        res.send(data);
      });
    } catch({message}) {
      res.send({
        error: true,
        messsage
      });
    }
  });
}