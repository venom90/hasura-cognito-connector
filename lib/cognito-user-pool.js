const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Connect with User Pool using the pool data from environment variables.
exports.userPool = userPool;
exports.AmazonCognitoIdentity = AmazonCognitoIdentity;

// Create Cognito User
exports.createCognitoUser = username => (
  new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: userPool
  })
);