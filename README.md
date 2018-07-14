# vuejs-elementui-aws basic admin panel for AWS EC2

Simple interface with signin and signup on AWS Cognito, cognito profile attributes editing, profile avatar upload to S3, basic logs to DynamoDB and manager EC2 instances to Start Stop and security group.

Uses aws-sdk, aws-amplify, Vuejs, veux, vue-router, element-ui and build with vue-cli 3

This app was created to be used as initial basis for other projects.

## What you can do with this app

- Signup and Signin in AWS Cognito services
- Has profile form to update user information and upload profile image
- After login, list all EC2 Instances and **test if the security group of each instance allow only the same public ip address you are at the moment loads the page** for RDP connections
- Power on and off instances
- Log actions to DynamoDB
- Prepared for public and protected routes with vue-router and amplify auth
- Mini messages/alert component based on vuex and element-ui
- Responsive header menu, using element-ui (non-existent in element-ui components)

## Not use in production

> **Be careful to put on production without customization, allow free signup will allow anyone in internet to turn on or off your instances.**

---

## Install and configure

> Before, read why i prefer not use awsmobile cli [here](#why-i-prefer-not-use-awsmobile-cli)

### Configuring Your AWS Account

Basic and easy way to deploy your files do AWS and configure S3, Cognito, Cloud Front and PinPoint environment.

````bash
# Clone project
  git clone https://github.com/abelmferreira/vuejs-elementui-aws

# install dependencies
  npm install

# enable and configure aws hosting (s3 + cloud front) and analytics (pinpoint)
  npm install -g awsmobile

# configure awsmobile creating super user, see how in references links
  awsmobile configure

# init a new project
  awsmobile init
  awsmobile user-files enable

# enable and configure aws cognito
  awsmobile user-signin enable --prompt
    ? Sign-in is currently disabled, what do you want to do next #Go to advanced settings
    ? Which sign-in method you want to configure #Cognito UserPools
    ? How are users going to login #Email, Username
    ? Password minimum length (number of characters) #8
    ? Password character requirements #uppercase, lowercase, numbers

# apply new configurations
  npm run push-aws

# serve at localhost:8080
  npm run dev

$ deploy to AWS
  npm run deploy
````

### Configuring EC2 permissions

To allow EC2 functions access <https://console.aws.amazon.com/iam> and create a new custom policie with json below, change ARN to your account ID and region.

Then find the role created by awsmobile cli, it will have your project name plus _auth and attach you new policie.

````json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": "arn:aws:ec2:<INSTANCES_REGION OR *>:<YOU_ACCOUNT_ID OR *>:instance/*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeInstanceStatus"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "ec2:RevokeSecurityGroupIngress",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:UpdateSecurityGroupRuleDescriptionsIngress"
            ],
            "Resource": "arn:aws:ec2:<INSTANCES_REGION OR *>:<YOU_ACCOUNT_ID OR *>:security-group/*"
        }
    ]
}
````

Then add to aws-exports.js

````js
const awsmobile = {
  ...
  'aws_ec2_region': 'YOUR REGION'
  ...
}
````

### Enable Logs to DynamoDB

````bash
# enable databese with awsmobile cli
  awsmobile database enable --prompt

  Welcome to NoSQL database wizard
  You will be asked a series of questions to help determine how to best construct your NoSQL database table.

  ? Should the data of this table be open or restricted by user? #Restricted
  Note: This will create a column called "userId"

  ? Table name #logs

  You can now add columns to the table.

  ? Would you like to add another column #Yes
  ? What would you like to name this column #created_at_ts
  ? Choose the data type #number
  ? Would you like to add another column #Yes
  ? What would you like to name this column #username
  ? Choose the data type #string
  ? Would you like to add another column #Yes
  ? What would you like to name this column #action
  ? Choose the data type #string
  ? Would you like to add another column #No

  We automatically selected the userId column as the primary key because you chose the table to be restricted. You can optionally choose to add a sort key.

  ? Select sort key #created_at_ts
  ? Add index #Yes

# apply new configurations and deploy
  npm run deploy
````

### Accessing the app

After each **npm run deploy** the awsmobile cli prints the urls

````bash
Successful!
your application is published and hosted at:
http://yourproject.s3-website.region.amazonaws.com
your application is also distributed through aws CloudFront
https://cloudfrontcode.cloudfront.net
please note that CloudFront content may not have been refreshed yet
````

---

### Why I prefer not use awsmobile cli and Mobile Hub services

Awsmobile cli is realy is a great tool to easy and fast configure aws environment.
But sometimes I prefer configure it manually beacause I cant set region, awsmobile uses us-west-1 by default, and use Cloud Front is not optional, small projects dont need cdn

And cli has boring stuff like: Automaticaly push on first init even if we have other settings to perform and Always after init command, it install aws-amplify with npm

---

## TODO

- [ ] Check if instance is windows or linux instances, and test RDP or SSH ports on Security Groups.
- [ ] Allow add news or change ports to test and configure in security group
- [ ] Migrate local ec2 and dynamoDB functions to Lambda Functions
- [ ] Allow add other instances not only from same region and account with
- [ ] Add Scheduler for admins tasks on panel

## Reference Links

- [How create a new aws mobile cli user](https://docs.aws.amazon.com/aws-mobile/latest/developerguide/aws-mobile-cli-credentials.html)
- [AWS Amplify Docs](https://aws.github.io/aws-amplify)
- [AWS Amplify Git-Hub](https://github.com/aws/aws-amplify)
- [AWS Amplify Git-Hub Vue-amplify Sample Project](https://github.com/aws-samples/aws-amplify-vue)
