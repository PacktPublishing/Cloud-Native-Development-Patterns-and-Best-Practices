# Event Orchestration

This example includes a Lambda function to put an order-submitted event the AWS Kinesis stream and a Lambda function to read from the stream and put additional events to an AWS Kinesis stream and react until no more events are produced by the orchestration.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-eo-dev`
   * Kinesis Stream: `cndp-eo-dev-stream`
   * Lambda functions: `cndp-eo-dev-submitter` and `cndp-eo-dev-listener`
4. Invoke Lambda function `cndp-eo-dev-submitter` from the AWS console by pressing the Test button.
   * Accept the defaults if asked.
5. Inspect the Lambda Monitoring tab and logs for each function
   * There should be multiple events received and produced as per the transitions defined in the handler.js
6. Inpsect the Stream monitoring tab
7. Execute: `npm run rm:dev:e`
