import * as Promise from 'bluebird-global';
import * as aws from 'aws-sdk';

const debug = require('debug')('connector');

aws.config.setPromisesDependency(Promise);

export class Connector {

  private db: any;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = new aws.DynamoDB.DocumentClient({
      httpOptions: { timeout: 3000 },
      logger: { log: /* istanbul ignore next */ msg => debug(msg) },
    });
  }

  save(body: any) {
    const params = {
      TableName: this.tableName,
      Item: body,
    };

    return this.db.put(params).promise()
      .tap(debug)
      ;
  }

  getById(id: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return this.db.get(params).promise()
      .tap(debug)
      .then(data => data.Item)
      ;
  }
}
