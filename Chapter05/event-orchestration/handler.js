'use strict';

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.submit = (evt, context, callback) => {
  const order = {
    id: uuid.v4(),
    status: 'submitted',
  };

  const event = {
    id: uuid.v1(),
    type: 'order-submitted',
    timestamp: Date.now(),
    order: order
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: order.id,
    Data: new Buffer(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params).promise()
    .then(resp => callback(null, resp))
    .catch(err => callback(err));
};

const transitions = [
  {
    filter: 'order-submitted',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'make-reservation', // reservation-pending
      timestamp: Date.now(),
      partitionKey: uow.event.order.id,
      reservation: {
        sku: uow.event.order.sku,
        quentity: uow.event.order.quentity,
      },
      context: {
        order: uow.event.order,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'reservation-confirmed',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'make-payment', // payment-pending
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      payment: {
        token: uow.event.context.order.token,
        amount: uow.event.context.order.amount,
      },
      context: {
        order: uow.event.context.order,
        reservation: uow.event.reservation,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'payment-confirmed',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'send-confirmation',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      message: {
        to: uow.event.context.order.submitter,
        from: process.env.FROM_ADDRESS,
        body: `Order: ${uow.event.context.order.id} is Confirmed`
      },
      context: {
        order: uow.event.context.order,
        reservation: uow.event.context.reservation,
        payment: uow.event.payment,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'payment-denied',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'cancel-reservation',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      reservation: {
        id: uow.event.context.reservation.id,
      },
      context: {
        order: uow.event.context.order,
        reservation: uow.event.context.reservation,
        payment: uow.event.payment,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'payment-denied',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'cancel-order',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      order: {
        id: uow.event.context.order.id,
      },
      context: {
        order: uow.event.context.order,
        reservation: uow.event.context.reservation,
        payment: uow.event.payment,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'cancel-reservation-confirmed',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'cancel-order',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      order: {
        id: uow.event.context.order.id,
      },
      context: {
        order: uow.event.context.order,
        reservation: uow.event.context.reservation,
        payment: uow.event.payment,
        trigger: uow.event.id
      }
    })
  },

  // simulate reservations and payments components as discussed in the testing chapter
  {
    filter: 'make-reservation',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'reservation-confirmed',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      context: {
        order: uow.event.context.order,
        reservation: uow.event.reservation,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'make-payment',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'payment-confirmed',
      timestamp: Date.now(),
      partitionKey: uow.event.context.order.id,
      context: {
        order: uow.event.context.order,
        reservation: uow.event.context.reservation,
        payment: uow.event.payment,
        trigger: uow.event.id
      }
    })
  },
  
];

module.exports.consume = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .tap(print)
    .filter(onTransitions)
    .flatMap(toEvent)
    .tap(print)
    .batch(25)
    .flatMap(publish)
    // .tap(print)
    .collect().toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(new Buffer(r.kinesis.data, 'base64')),
});

const onTransitions = uow => {
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
  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: batch.map(event => ({
      PartitionKey: event.partitionKey,
      Data: new Buffer(JSON.stringify(event)),
    }))
  };

  print(params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecords(params).promise());
}

const print = e => console.log('event: %s', JSON.stringify(e, null, 2));
