# Hasura and AWS Cognito Connector

A microservice to connect AWS cognito with Hasura. This program is written in Node.js and Express.js framework.

## Environment Variables
* CLAIM_ENDPOINT : The prefix to hasura claim URL. The final URL is CLAIM_ENDPOINT + /hasura/claim. This is optional.
* CLAIM_METHOD : The HTTP method for claim, it can be GET or POST. The default is GET
* PUBLIC_ROLE : Define what you role you want to assign to non-authenticated users. The default is 'public'
* USER_ID_ATTRIBUTE : Cognito User ID Attribute
* USER_ROLE_ATTRIBUTE : Cognito User Role Attribute
* AWS_REGION : Cognito AWS region. The default is 'us-east-1'
* COGNITO_CLIENT_ID : Cognito Client ID
* COGNITO_USER_POOL_ID : Cognito User pool

# Installation

Build Dockerfile

```
docker build -t hasura-connector:latest .
```

Run

```
docker run hasura-connector:latest
```
