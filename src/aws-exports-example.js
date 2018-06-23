export default {

  // https://aws.github.io/aws-amplify/media/storage_guide
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
    // REQUIRED - Amazon Cognito Region
    region: 'XX-XXXX-X',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'XX-XXXX-X_abcd1234',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3'
  },

  // https://aws.github.io/aws-amplify/media/storage_guide
  Analytics: {
    // OPTIONAL -  Amazon Pinpoint App Client ID
    appId: 'c168dadb756341dc84b78343e46d91da',
    // OPTIONAL -  Amazon service region
    region: 'XX-XXXX-X'
  },

  // https://aws.github.io/aws-amplify/media/storage_guide
  Storage: {
    // REQUIRED -  Amazon S3 bucket
    bucket: '',
    // OPTIONAL -  Amazon service region
    region: 'XX-XXXX-X'
  },

  // https://aws.github.io/aws-amplify/media/api_guide
  API: {
    endpoints: [
      {
        name: 'MyCustomLambdaApi',
        endpoint: 'https://lambda.us-east-1.amazonaws.com/2015-03-31/functions/yourFuncName/invocations',
        service: 'lambda',
        region: 'us-east-1',
        custom_header: async () => {
          return { Authorization: 'token' }
          // Alternatively, with Cognito User Pools use this:
          // return { (await Auth.currentSession()).idToken.jwtToken }
        }
      }
    ]
  }
}
