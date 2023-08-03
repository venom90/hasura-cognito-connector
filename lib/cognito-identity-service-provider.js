const AWS = require('aws-sdk');

AWS.config.region = process.env.AWS_REGION || 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.COGNITO_USER_POOL_ID,
});
AWS.config.setPromisesDependency(require('bluebird'));

exports.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();