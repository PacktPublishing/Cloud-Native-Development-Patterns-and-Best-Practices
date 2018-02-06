import * as _ from 'highland';

export const cors = {
  // Required for CORS support to work
  'Access-Control-Allow-Origin': '*',
  // Required for cookies, authorization headers with HTTPS
  'Access-Control-Allow-Credentials': true,
};

export const noCache = {
  'Cache-Control': 'no-cache',
};

export const maxAge3 = {
  'Cache-Control': 'max-age=3',
};

export const toCallback = (cb) => {
  return s => s.consume((err, x, push, next) => {
    /* istanbul ignore if */
    if (err) {
      cb(err);
    } else if (x === _.nil) {
      cb();
    } else {
      next();
    }
  })
    .resume()
    ;
};
