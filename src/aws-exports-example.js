// References links
// https://aws-amplify.github.io/amplify-js/media/authentication_guide
// https://aws.github.io/aws-amplify/media/storage_guide
// https://aws-amplify.github.io/amplify-js/media/analytics_guide
// https://aws.github.io/aws-amplify/media/api_guide

const awsmobile = {
  'aws_app_analytics': 'enable',
  'aws_cognito_identity_pool_id': 'us-west-2:a5e6asda-asd-123-asd12-dc32ce9a8a54',
  'aws_cognito_region': 'us-west-2',
  'aws_content_delivery': 'enable',
  'aws_content_delivery_bucket': 'vuejselementuiaws-hosting-mobilehub-23424234',
  'aws_content_delivery_bucket_region': 'us-west-1',
  'aws_content_delivery_cloudfront': 'enable',
  'aws_content_delivery_cloudfront_domain': 'd24fkbb6drgybb.cloudfront.net',
  'aws_dynamodb': 'enable',
  'aws_dynamodb_all_tables_region': 'us-west-1',
  'aws_dynamodb_table_schemas': [{'tableName': 'vuejselementuiaws-mobilehub-2342342-logs', 'attributes': [{'name': 'userId', 'type': 'S'}, {'name': 'created_at_ts', 'type': 'N'}, {'name': 'action', 'type': 'S'}, {'name': 'username', 'type': 'S'}], 'indexes': [], 'region': 'us-west-1', 'hashKey': 'userId', 'rangeKey': 'created_at_ts'}],
  'aws_mandatory_sign_in': 'enable',
  'aws_mobile_analytics_app_id': 'e89951ff6417409aba9d8c20a3f65372',
  'aws_mobile_analytics_app_region': 'us-east-1',
  'aws_project_id': '46635asdasd-adasd-asdasd-eb409df2',
  'aws_project_name': 'vuejs-elementui-aws-2018-07-13-18-28-30',
  'aws_project_region': 'us-west-1',
  'aws_resource_name_prefix': 'vuejselementuiaws-mobilehub-118434234234022567',
  'aws_sign_in_enabled': 'enable',
  'aws_user_files': 'enable',
  'aws_user_files_s3_bucket': 'vuejselementuiaws-userfiles-mobilehub-23423424234',
  'aws_user_files_s3_bucket_region': 'us-west-1',
  'aws_user_pools': 'enable',
  'aws_user_pools_id': 'us-west-2_OCEjxgc6P',
  'aws_user_pools_mfa_type': 'OFF',
  'aws_user_pools_web_client_id': '3422434234234',
  'aws_ec2_region': 'us-east-1'
}

export default awsmobile
