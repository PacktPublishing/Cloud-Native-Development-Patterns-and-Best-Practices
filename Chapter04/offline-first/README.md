# Offline-First Database

This example includes a simple React application that stores data in an AWS Cognito Identity Pool Dataset. Dataset events are sent to a Kinesis stream, a trigger Lambda function consumes the dataset events from the stream and produces domain events to the stream, another Lambda function consumes the domain events and updates a materialized view in another Cognito Dataset, and finally the React app syncs that data from the materialized view.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-offline-first-dev`
   * Cognito Identity Pool: `offlineFirstIdentityPool`
   * Cognito Identities: `dev-cndp-offline-first-view`
   * Kinesis Stream: `dev-us-east-1-cndp-offline-first-stream`
   * Lambda functions: `cndp-offline-first-dev-trigger` and `cndp-offline-first-dev-consumer`
4. Edit the index.html to update the IdentityPoolId to the value printed to the screen once the deployment was completed.
5. Now open the index.html file, press the Increment button a few times and then press the Synchronize button
6. Inspect the Cognito Identities dataset
7. Inspect the Lambda Monitoring tab and logs for each function
8. Execute: `npm run rm:dev:e`
