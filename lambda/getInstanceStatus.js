const AWS = require('aws-sdk')

// Set the region
AWS.config.update({region: (process.env.AWS_REGION)})

// Create EC2 service object
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

// let params = {
//   DryRun: true || false,
//   Filters: [
//     {
//       Name: 'STRING_VALUE',
//       Values: [
//         'STRING_VALUE',
//         /* more items */
//       ]
//     },
//     /* more items */
//   ],
//   InstanceIds: [
//     'STRING_VALUE',
//     /* more items */
//   ],
//   MaxResults: 0,
//   NextToken: 'STRING_VALUE'
// };

const params = {
  InstanceIds: ['i-08xxxxxx']
}

exports.handler = (event, context, callback) => {
  if (!event.requestContext.authorizer) {
    errorResponse('Authorization not configured', context.awsRequestId, callback)
    return
  }

  // Because we're using a Cognito User Pools authorizer, all of the claims
  // included in the authentication token are provided in the request context.
  // This includes the username as well as other attributes.
  // const username = event.requestContext.authorizer.claims['cognito:username']

  // The body field of the event in a proxy integration is a raw string.
  // In order to extract meaningful values, we need to first parse this string
  // into an object. A more robust implementation might inspect the Content-Type
  // header first and use a different parsing strategy based on that value.
  // const requestBody = JSON.parse(event.body)

  // You can use the callback function to provide a return value from your Node.js
  // Lambda functions. The first parameter is used for failed invocations. The
  // second parameter specifies the result data of the invocation.

  // Because this Lambda function is called by an API Gateway proxy integration
  // the result object must use the following structure.
  //   callback(null, {
  //     statusCode: 201,
  //     body: JSON.stringify({
  //         RideId: rideId,
  //         Unicorn: unicorn,
  //         Eta: '30 seconds',
  //         Rider: username,
  //     }),
  //     headers: {
  //         'Access-Control-Allow-Origin': '*',
  //     },
  // });

  // If there is an error during processing, catch it and return
  // from the Lambda function successfully. Specify a 500 HTTP status
  // code and provide an error message in the body. This will provide a
  // more meaningful error response to the end client.
  //
  // errorResponse(err.message, context.awsRequestId, callback)

  // Call EC2 to retrieve the policy for selected bucket
  ec2.describeInstances(params, function (err, data) {
    if (err) {
      console.log('Error', err.stack)
      errorResponse(err.message, context.awsRequestId, callback)
    } else {
      // console.log("Success", JSON.stringify(data));

      let returnData = []
      data.Reservations[0].Instances.forEach(instance => {
        returnData.push({
          InstanceId: instance.InstanceId,
          LaunchTime: instance.LaunchTime,
          IpAddress: instance.PublicIpAddress,
          State: instance.State.Name,
          StateReason: instance.StateReason
        })
      })

      callback(null, {
        statusCode: 201,
        body: JSON.stringify(returnData),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  })
}

function errorResponse (errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId
    }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}
