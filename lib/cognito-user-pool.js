const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID
};

// Connect with User Pool using the pool data from environment variables.
exports.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
exports.AmazonCognitoIdentity = AmazonCognitoIdentity;