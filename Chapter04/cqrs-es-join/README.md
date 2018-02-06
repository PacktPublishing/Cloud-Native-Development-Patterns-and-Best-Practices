# CQRS Event Sources Join

This example includes a Lambda function to write events to a Kinesis stream, and Lambda function to consume from the stream and write to a DynamoDB table, a Lambda function to triggered by the dynamodb stream and writes to another dynamodb table.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-cqrs-es-join-dev`
   * DynamoDB Tables: `dev-cndp-cqrs-es-join-events` and `dev-cndp-cqrs-es-join-view`
   * Kinesis Stream: `dev-us-east-1-cndp-cqrs-es-join-stream`
   * Lambda functions: `cndp-cqrs-es-join-dev-command`, `cndp-cqrs-es-join-dev-consumer` and `cndp-cqrs-es-join-dev-trigger`
4. Invoke Lambda function `cndp-cqrs-es-join-dev-command` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the DynamoDB tables for the new contents
6. Inspect the Lambda Monitoring tab and logs for each function
7. Execute: `npm run rm:dev:e`
