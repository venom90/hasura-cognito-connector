const jwtDecode = require('jwt-decode');
const { AmazonCognitoIdentity, createCognitoUser, userPool } = require('../lib/cognito-user-pool');
const { cognitoidentityserviceprovider } = require('../lib/cognito-identity-service-provider');
const { traceError } = require('../lib/util');
const publicRole = process.env.PUBLIC_ROLE || 'public';
const { executeGraphQL } = require('../lib/util');

const GET_USER_GROUPS = `
  query GetUserGroups($id: uuid) {
    users(where: {id: {_eq: $id}}) {
      user_group_assigns {
        user_group {
          name
        }
      }
    }
  }
`

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
        const user_id = attributes.find(attribute => attribute.Name === process.env.USER_ID_ATTRIBUTE).Value;
        
        const variables = {
          id: user_id
        }

        // Check if provided OTP is presend in DB
        const { errors, data: {users} } = await executeGraphQL(GET_USER_GROUPS, variables, 'POST');

        let groups = '';
        if (Array.isArray(users) && users.length > 0 && users[0].user_group_assigns) {
          const arr = users[0].user_group_assigns;
          const collection = arr.map(item => (item.user_group.name))
          groups = collection.join('')
        }

        res.send({
          "X-Hasura-User-Id": user_id,
          "X-Hasura-Role": groups || role
        })
      }
    } catch ({message}) {
      res.send({
        "X-Hasura-Role": 'anonymous'
      });
    }
  });
}