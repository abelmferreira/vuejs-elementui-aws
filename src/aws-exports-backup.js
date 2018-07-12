import { Auth } from 'aws-amplify'

export default {
  Auth: {
    identityPoolId: 'us-east-1:12100891-8f52-47ee-ad70-c0195c6ee819',
    region: 'us-east-1',
    userPoolId: 'us-east-1_xebSreGtR',
    userPoolWebClientId: '3pgjevd28edujvnk0sovso7abe'
  },
  Analytics: {
    appId: 'c168dadb756341dc84b78343e46d91da',
    region: 'us-east-1'
  },
  Storage: {
    bucket: 'vuejsapp-userfiles-mobilehub-1096733156',
    region: 'us-east-1'
  },
  API: {
    endpoints: [
      {
        name: 'Ride',
        endpoint: 'https://cq6rzeo1qi.execute-api.us-east-1.amazonaws.com/prod',
        service: 'lambda',
        region: 'us-east-1',
        custom_header: async () => {
          return { Authorization: (await Auth.currentSession()).idToken.jwtToken }
        }
      }
    ]
  },
  DynamoDB: {
    table: 'vuejsapp-mobilehub-1096733156-log',
    region: 'us-east-1'
  },
  EC2: {
    region: 'us-east-1'
  }
}
