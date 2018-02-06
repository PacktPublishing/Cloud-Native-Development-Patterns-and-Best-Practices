import * as aws from 'aws-sdk';
import * as uuid from 'uuid';
import * as _ from 'highland';

import { Event } from './api';

import { toCallback } from './utils';
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
      .filter(forOrderSubmitted)
      .map(toEvent)
      // .tap(print)
      .map(toRecord)
      // .tap(print)
      .batch(25)
      .flatMap(publish)
      ;
  }
}

/* istanbul ignore next */
const print = e => debug('stream: %s', JSON.stringify(e, null, 2));

const recordToUow = r => ({
  record: r,
});

const forOrderSubmitted = uow => uow.record.dynamodb.NewImage &&
  uow.record.dynamodb.NewImage.status &&
  uow.record.dynamodb.NewImage.status.S === 'submitted';

const toEvent = (uow) => {
  uow.event = {
    id: uuid.v1(),
    type: `order-submitted`,
    timestamp: uow.record.dynamodb.ApproximateCreationDateTime * 1000,
    partitionKey: uow.record.dynamodb.Keys.id.S,
    order: aws.DynamoDB.Converter.unmarshall(uow.record.dynamodb.NewImage),
  };

  return uow;
};

const toRecord = (uow) => {
  uow.params = {
    PartitionKey: uow.event.order.id,
    Data: new Buffer(JSON.stringify(uow.event)),
  };

  return uow;
};

const publish = (batch) => {
  const stream = new Connector(process.env.STREAM_NAME);
  const p = stream.publish(batch.map(uow => uow.params))
    .then(() => batch);
  return _(p);
};
