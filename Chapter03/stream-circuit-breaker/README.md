# Stream Circuit Breaker

This example includes a Lambda function to put an event to an AWS Kinesis stream and a Lambda function to read from the Kinesis stream and put a record to an DynamoDB Table and includes error handling.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-event-circuit-breaker-dev`
   * DynamoDB Table: `cndp-event-circuit-breaker-dev-t1`
   * Kinesis Stream: `cndp-event-circuit-breaker-dev-stream`
   * Lambda functions: `cndp-event-circuit-breaker-dev-producer` and `cndp-event-circuit-breaker-dev-consumer`
4. Invoke Lambda function `cndp-event-circuit-breaker-dev-producer` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the DynamoDB table for the new contents
6. Inspect the Lambda Monitoring tab and logs for each function
   * a good event should have updated the dynamodb table.
   * some fault events should have been published for validation errors and caused invocation of the consumer again.
   * a random error should have caused multiple invocations of the consumer. If not execute the producer again.
7. Inpsect the Stream monitoring tab
8. Execute: `npm run rm:dev:e`
