const jwtDecode = require('jwt-decode');
const { AmazonCognitoIdentity, createCognitoUser, userPool } = require('../lib/cognito-user-pool');
const { cognitoidentityserviceprovider } = require('../lib/cognito-identity-service-provider');
const { traceError } = require('../lib/util');
const publicRole = process.env.PUBLIC_ROLE || 'public';

module.exports = app => {
  app[process.env.CLAIM_METHOD || 'get'](process.env.CLAIM_ENDPOINT || '/hasura/claim', async (req, res) => {
    try {
      const { token } = req.headers;

      // IF token IS EMPTY OR null OR undefined
      if (!token) {
        // THEN send default public role
        res.send({
          "X-Hasura-Role": publicRole
        });
      } else {
        // ELSE token IS NOT EMPTY
        const params = { AccessToken: token };
        const userResult = await cognitoidentityserviceprovider.getUser(params).promise();

        const attributes = userResult.UserAttributes;
        const role = attributes.find(attribute => attribute.Name === process.env.USER_ROLE_ATTRIBUTE).Value;
        
        res.send({
          "X-Hasura-User-Id": userResult.Username,
          "X-Hasura-Role": role
        })
      }
    } catch ({message}) {
      res.send({error: true, message});
    }
  });
}