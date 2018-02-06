# API Gateway

This example includes several Lambda function and an API Gateway.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-api-gateway-dev`
   * Lambda functions: `cndp-api-gateway-dev-*`
   * API Gateway: `cndp-api-gateway`
   * DynamoDB Table: `dev-cndp-api-gateway-items`
4. Test locally with dynamoDB remote
   * To start serverless-offline, execute in a separate console: `npm start`
   * Execute tests in the original console: `npm test`
5. Inspect the DynamoDB table for the new contents
6. Invoke GET api from the API Gateway console by pressing the `Invoke URL` link:
   * APIs > dev-cndp-api-gateway (...) > Stages > dev > /items/{id} > GET
   * NOTE: change {id} to 00000000-0000-0000-0000-000000000000
7. Inspect the Lambda Monitoring tab and logs for function: `cndp-api-gateway-dev-get`
8. Execute: `npm run rm:dev:e`
