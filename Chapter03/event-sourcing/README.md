# Event Sourcing

This example includes a Lambda function to put a record to an DynamoDB Table and a Lambda function to read from the DynamoDB stream and put an event to an AWS Kinesis stream.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-event-sourcing-dev`
   * DynamoDB Table: `cndp-event-sourcing-dev-t1`
   * Kinesis Stream: `cndp-event-sourcing-dev-stream`
   * Lambda functions: `cndp-event-sourcing-dev-command` and `cndp-event-sourcing-dev-trigger`
4. Invoke Lambda function `cndp-event-sourcing-dev-command` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the DynamoDB table for the new contents
6. Inspect the Lambda Monitoring tab and logs for each function
7. Inpsect the Stream monitoring tab
8. Execute: `npm run rm:dev:e`
