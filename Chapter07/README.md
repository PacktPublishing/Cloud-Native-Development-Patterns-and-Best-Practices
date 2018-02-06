# Testing

Chapter 7 is about Testing, specifically testing in isolation and transitive testing. As such, these examples do not need to be deployed. All the tests can be executed without a deployment. Only the event-service must be deployed. Deployment is only necessary for the other projects to experiement with re-recording the payloads.

> _Please refer to the root README for installation and general instructions._

## Deploy Steps
Note: the deployment order. The event-service must be deployed first.
### event-service
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
### order-service
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`
### order-process
1. Execute: `npm install`
2. Execute: `npm run dp:dev:e`


## Testing Steps
Note: The event-service project does not have tests, as it only defines the Kinesis stream.
### order-frontend
1. Execute: `npm install`
2. Execute: `npm test:int`
### order-service
1. Execute: `npm install`
2. Execute: `npm test`
3. Review ./coverage/index.html
4. Execute: `npm test:int`
### order-process
1. Execute: `npm install`
2. Execute: `npm test`
3. Review ./coverage/index.html
4. Execute: `npm test:int`


## Re-record Steps
VCR recording often need to be re-recorded as the requirements changes.
1. Review Replay settings: https://www.npmjs.com/package/replay#settings
2. Review the fixture folders in the projects
   * Specifically the submit-order files under: 
      * order-frontend/fixtures/0.0.0.0-3000 
      * order-service/fixtures/dynamodb.us-east-1.amazonaws.com-443/
3. Start order-service locally in bloody mode
   * Execute in another command line console: `DEBUG=* REPLAY=bloody npm start`
4. Run order-frontend tests in bloody mode
   * Execute: `DEBUG=replay REPLAY=bloody npm run test:int`
   * Review the order-service console above
5. Repeat steps 3 and 4 with `REPLAY=record`
   * since the recordings are present they are used
6. Repeat step 5 but delete the following first:
   * the submit-order files under order-frontend/fixtures/0.0.0.0-3000/ and order-service/fixtures/dynamodb.us-east-1.amazonaws.com-443
   * note that new recordings are generated

## Undeploy Steps
Note: the reverse order.
### order-process
1. Execute: `npm install`
2. Execute: `npm run rm:dev:e`
### order-service
1. Execute: `npm install`
2. Execute: `npm run rm:dev:e`
### event-service
1. Execute: `npm install`
2. Execute: `npm run rm:dev:e`
