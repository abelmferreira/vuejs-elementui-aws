# vujs-elementui-start
Simple interface using Vuejs, vex, vue-router, element-ui with protected routes, login page, messages system and responsive menu

Login page using Cognito and Ec2 instance list

This app was created to be used as an initial basis for other projects.

Was build with Vue-cli 3 with pwa, vuex and vue-router.

Uses element-ui for styles and has a responsive menu (non-existent in element-ui components)

It has a simple layer to protect routes that need authentication.

And small helper for sending notifications messages to user with vuex and element-ui



Baseado em 
https://aws.github.io/aws-amplify
https://github.com/aws/aws-amplify
https://github.com/aws-samples/aws-amplify-vue
https://github.com/aws-samples/aws-serverless-workshops/tree/master/WebApplication
https://codeburst.io/tutorial-for-building-a-web-application-with-amazon-s3-lambda-dynamodb-and-api-gateway-6d3ddf77f15a



## Try it
````
# Clone project
git clone https://github.com/abelmferreira/vuejs-elementui-aws.git

# install dependencies
npm install

# serve with hot reload at localhost:8887
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
````