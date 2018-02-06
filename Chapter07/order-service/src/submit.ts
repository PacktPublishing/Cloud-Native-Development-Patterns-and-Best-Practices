import { Status } from './api';
import { cors, noCache } from './utils';
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
    const order = JSON.parse(event.body);

    order.status = Status.Submitted;
    debug('order: %j', order);

    return new Connector(process.env.TABLE_NAME)
      .save(order)
      .then(data => ({
        statusCode: 200,
        headers: {
          ...cors,
          ...noCache,
        },
      }),
    );
  }
}
