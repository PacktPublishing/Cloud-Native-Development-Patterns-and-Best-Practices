import * as _ from 'highland';

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

export const now = () => Date.now();
