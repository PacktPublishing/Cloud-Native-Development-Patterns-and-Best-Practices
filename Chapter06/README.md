# Deployment

This example demostrates the deployment pipeline and includes several Lambda function and an API Gateway.

> _Please refer to the root README for installation and general instructions._

## Steps
These steps mimic the .gitlab-ci.yml.
1. Execute: `npm install`
2. Execute: `npm test`
3. Execute: `npm run test:int`
4. Execute: `npm run dp:stg:e`
5. In the AWS console review the various tabs for the following:
   * Cloudformation Stack: `cndp-my-component-stg`
   * Lambda functions: `cndp-my-component-stg-get`
      * Note the environment variables
   * API Gateway: `cndp-my-component`
6. Invoke GET api from the API Gateway console by pressing the `Invoke URL` link:
   * APIs > dev-cndp-my-component (...) > Stages > stg > /items/{id} > GET
   * NOTE: change {id} to 00000000-0000-0000-0000-000000000000
7. Inspect the Lambda Monitoring tab and logs for function: `cndp-my-component-stg-get`
8. Execute: `npm run rm:stg:e`
