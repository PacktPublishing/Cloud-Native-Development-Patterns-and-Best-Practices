# Cloud Native Databases Per Component

This example includes a Lambda function to update a DynamoDB table which then triggers a Lambda function to update an S3 bucket.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-cloud-native-db-dev`
   * DynamoDB Table: `dev-cndp-cloud-native-db-t1`
   * S3 Bucket: `dev-us-east-1-cndp-cloud-native-db-b1`
   * Lambda functions: `cndp-cloud-native-db-dev-command` and `cndp-cloud-native-db-dev-trigger`
4. Invoke Lambda function `cndp-cloud-native-db-dev-command` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the DynamoDB table and S3 bucket for the new contents
6. Inspect the Lambda Monitoring tab and logs for each function
7. Manually delete the contents of the bucket from the AWS Console: `dev-us-east-1-cndp-cloud-native-db-b1`
   * Otherwise removal of the stack will fail in the next step
8. Execute: `npm run rm:dev:e`
