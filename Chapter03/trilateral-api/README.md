# Trilateral API

This example includes several Lambda function and an API Gateway.

> _Please refer to the root README for installation and general instructions._

## Steps
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
3. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-trilateral-api-dev`
   * Lambda functions: `cndp-trilateral-api-dev-*`
   * API Gateway: `cndp-trilateral-api`
4. Invoke GET api from the API Gateway console by pressing the `Invoke URL` link:
   * APIs > dev-cndp-trilateral-api (...) > Stages > dev > /things/{id} > GET
6. Inspect the Lambda Monitoring tab and logs for function: `cndp-trilateral-api-dev-query`
8. Execute: `npm run rm:dev:e`
