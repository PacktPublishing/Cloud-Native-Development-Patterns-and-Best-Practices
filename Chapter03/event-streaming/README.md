# Event Streaming

This example includes a Lambda function to put a record to an AWS Kinesis stream and a Lambda function to read from the stream.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-event-streaming-dev`
   * Kinesis Stream: `cndp-event-streaming-dev-stream`
   * Lambda functions: `cndp-event-streaming-dev-producer` and `cndp-event-streaming-dev-consumer`
4. Invoke Lambda function `cndp-event-streaming-dev-producer` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the Lambda Monitoring tab and logs for each function
6. Execute: `npm run rm:dev:e`
