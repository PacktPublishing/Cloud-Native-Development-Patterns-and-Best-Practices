# External Service Gateway

This example includes a Lambda function to write events to a Kinesis stream, a Lambda function to consume from the stream and create auser in AWS Cognito, and a Lambdafunction triggers by AWS Cognito.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-external-service-gateway-dev`
   * Cognito User Pool: `esgUserPool`
   * Kinesis Stream: `dev-us-east-1-cndp-external-service-gateway-stream`
   * Lambda functions: `cndp-external-service-gateway-dev-producer`, `cndp-external-service-gateway-dev-consumer` and `cndp-external-service-gateway-dev-trigger`
4. Invoke Lambda function `cndp-external-service-gateway-dev-producer` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the User pool for the new user
6. Inspect the Lambda Monitoring tab and logs for the consumer function
7. Go to mailinator.com and check the inbox for fred.user@mailinator.com
8. Edit confirmation.html to update the UserPoolId and ClientId with values printed to screen after deploy
9. Open confirmation.html and enter the values from the email and a new password such as P@ssword01 and press submit
10. Inspect the User pool for the update to the user
11. Inspect the Lambda Monitoring tab and logs for the trigger function
12. Execute: `npm run rm:dev:e`
