import * as aws from 'aws-sdk';
import * as uuid from 'uuid';
import * as _ from 'highland';

import { Event } from './api';

import { toCallback, now } from './utils';
import { Connector } from './connectors/stream';

const debug = require('debug')('handler');

export const handle = (event, context, cb): void => {
  debug('event: %j', event);
  debug('context: %j', context);

  new Handler().handle(event)
    .tap(debug)
    .through(toCallback(cb));
};

export class Handler {

  handle(event: any): any {
    return _(event.Records)
      .map(recordToUow)
      // .tap(print)
      .filter(onTransitions)
      .flatMap(toEvent)
      // .tap(print)
      .batch(25)
      .flatMap(publish)
      .tap(print)
      ;
  }
}

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64').toString()),
});

const onTransitions = uow => {
  debug('uow: %s', JSON.stringify(uow, null, 2));
  // find matching transitions
  uow.transitions = transitions.filter(trans => trans.filter === uow.event.type);

  // multiple transitions constitute a fork
  // can leverage event sourcing to implement process joins

  // proceed forward if there are any matches
  return uow.transitions.length > 0;
};

const toEvent = uow => {
  // create the event to emit
  // for each matching transition
  return _(uow.transitions.map(t => t.emit(uow)));
};

const publish = batch => {
  debug('batch: %j', batch);

  const records = batch.map(event => ({
    PartitionKey: event.partitionKey,
    Data: new Buffer(JSON.stringify(event)),
  }));

  const p = new Connector(process.env.STREAM_NAME).publish(records)
    .then(() => batch)
    ;

  return _(p);
}

const print = e => debug('event: %j', e);

const transitions = [
  {
    filter: 'order-submitted',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'order-received', // since the ESG gateway is not implemented yet
      timestamp: now(),
      partitionKey: uow.event.order.id,
      context: {
        order: uow.event.order,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'order-received',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'order-fulfilled', // since the ESG gateway is not implemented yet
      timestamp: now(),
      partitionKey: uow.event.context.order.id,
      context: {
        order: uow.event.context.order,
        trigger: uow.event.id
      }
    })
  },
];
