import { cors, maxAge3 } from './utils';
import { Connector } from './connectors/database';

const debug = require('debug')('handler');

export const handle = (event, context, cb): void => {
  debug('event: %j', event);
  debug('context: %j', context);

  new Handler().handle(event)
    .tap(debug)
    .asCallback(cb);
};

export class Handler {

  handle(event: any): Promise<any> {
    const id = event.pathParameters.id;

    return new Connector(process.env.TABLE_NAME)
      .getById(id)
      .then(data => ({
        statusCode: data === undefined ? 404 : 200,
        headers: {
          ...cors,
          ...maxAge3,
        },
        body: JSON.stringify(data),
      }),
    );
  }
}
