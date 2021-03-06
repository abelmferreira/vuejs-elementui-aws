import { Logger } from 'aws-amplify'
import { DynamoDB } from 'aws-sdk'
import aws from '@/aws-exports'

const logger = new Logger('DynamoDB')

// Api Guide
// https://github.com/aws/aws-amplify/issues/581
// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.JavaScript.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html

export default {
  async registerAll ({dispatch, rootState}, credentials = null) {
    if (!credentials) credentials = rootState.User.user
    await dispatch('registerDatabase', credentials)
    await dispatch('registerDoc', credentials)
  },

  async registerDatabase ({commit, rootState}, credentials = null) {
    if (!credentials) credentials = rootState.User.user

    const db = new DynamoDB({
      apiVersion: '2012-08-10',
      region: aws.aws_dynamodb_all_tables_region,
      credentials: credentials,
      sessionToken: credentials
    })
    logger.debug('Database registered')
    await commit('setDatabase', db)
  },

  async registerDoc ({commit, rootState}, credentials = null) {
    if (!credentials) credentials = rootState.User.user

    const doc = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
      region: aws.aws_dynamodb_all_tables_region,
      credentials: credentials,
      sessionToken: credentials
    })
    logger.debug('Doc registered')
    await commit('setDocClient', doc)
  },

  describeTable ({state}, table) {
    if (!state.db) throw new Error('Database not registered!')
    if (!table) table = aws.aws_dynamodb_table_schemas[0].tableName

    return state.db.describeTable({TableName: table}, (err, data) => {
      if (err) throw new Error(err.message)
      return data
    })
  },

  queryAllFromUser ({state}, user) {
    if (!state.doc) throw new Error('Doc not registered!')

    const params = {
      TableName: aws.aws_dynamodb_table_schemas[0].tableName,
      KeyConditionExpression: `#uid = :authUid`,
      ExpressionAttributeNames: {
        '#uid': 'userId'
      },
      ExpressionAttributeValues: {
        ':authUid': user.id
      }
    }

    return state.doc.query(params, (err, data) => {
      if (err) throw new Error(err.message)
      return data
    })
  },

  put ({state}, payload) {
    if (!state.doc) throw new Error('Doc not registered!')

    const date = new Date()

    let newItem = {
      'userId': payload.user.id,
      'username': payload.user.username,
      'action': 'newItem',
      'created_at_ts': (date.getTime())
      // 'created_at_iso': (date.toISOString())
    }

    newItem = Object.assign(newItem, payload.item)

    const params = {
      Item: newItem,
      TableName: aws.aws_dynamodb_table_schemas[0].tableName
    }

    return state.doc.put(params, (err, data) => {
      if (err) throw new Error(err.message)
      return data
    })
  },

  log ({state, dispatch}, payload) {
    if (aws.aws_dynamodb !== 'enable') return

    dispatch('registerDoc', payload.user)

    if (!state.doc) throw new Error('Doc not registered!')
    const date = new Date()
    const params = {
      Item: {
        'userId': payload.user.id,
        'username': payload.user.username,
        'action': payload.action,
        'created_at_ts': (date.getTime()),
        'created_at_iso': (date.toISOString())
      },
      TableName: aws.aws_dynamodb_table_schemas[0].tableName
    }

    return state.doc.put(params, (err, data) => {
      if (err) throw new Error(err.message)
      else return data
    })
  }
}

// export default {
//   async registerAll ({dispatch}) {
//     await dispatch('registerDatabase')
//     await dispatch('registerDoc')
//   },

//   registerDatabase ({commit}) {
//     return Auth.currentCredentials()
//       .then(credentials => {
//         if (!credentials) throw new Error('Invalid User Credentials!')

//         const db = new DynamoDB({
//           apiVersion: '2012-08-10',
//           region: aws.DynamoDB.region,
//           credentials: credentials,
//           sessionToken: credentials
//         })
//         logger.debug('Database registered')
//         commit('setDatabase', db)
//       })
//   },

//   registerDoc ({commit, rootState}) {
//     return Auth.currentCredentials()
//       .then(credentials => {
//         if (!credentials) throw new Error('Invalid User Credentials!')

//         const doc = new DynamoDB.DocumentClient({
//           apiVersion: '2012-08-10',
//           region: aws.DynamoDB.region,
//           credentials: credentials,
//           sessionToken: credentials
//         })
//         logger.debug('Doc registered')
//         return commit('setDocClient', doc)
//       })
//   }
