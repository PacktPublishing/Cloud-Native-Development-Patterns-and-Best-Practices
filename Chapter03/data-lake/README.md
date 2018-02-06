# Data Lake

This example includes a Lambda function to put a record to an AWS Kinesis stream and a Kinesis Firehose to read from the stream and store the events in S3.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-data-lake-dev`
   * Kinesis Stream: `cndp-data-lake-dev-stream`
   * Kinesis Firehose: `cndp-data-lake-dev-DeliveryStream*`
   * S3 Bucket: `dev-us-east-1-cndp-data-lake-datalake`
   * Lambda functions: `cndp-data-lake-dev-producer`
4. Invoke Lambda function `cndp-data-lake-dev-producer` from the AWS console by pressing the Test button several times.
   * Accept the defaults if asked.
5. Inspect the S3 bucket for the new contents
6. Inspect the Lambda Monitoring tab and logs for each function
7. Inpsect the Stream monitoring tab
8. Manually delete the contents of the bucket from the AWS Console: `dev-us-east-1-cndp-data-lake-datalake`
   * Otherwise removal of the stack will fail in the next step
9. Execute: `npm run rm:dev:e`
