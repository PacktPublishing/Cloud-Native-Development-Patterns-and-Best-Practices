import * as Promise from 'bluebird-global';
import * as aws from 'aws-sdk';

const debug = require('debug')('connector');

aws.config.setPromisesDependency(Promise);

export class Connector {

  private stream: any;
  private streamName: string;

  constructor(streamName: string) {
    this.streamName = streamName;
    this.stream = new aws.Kinesis({
      httpOptions: { timeout: 3000 },
      logger: { log: /* istanbul ignore next */ msg => debug(msg) },
    });
  }

  publish(records: any[]) {
    const params = {
      StreamName: this.streamName,
      Records: records,
    };

    return this.stream.putRecords(params).promise()
      .tap(debug)
      ;
  }
}
