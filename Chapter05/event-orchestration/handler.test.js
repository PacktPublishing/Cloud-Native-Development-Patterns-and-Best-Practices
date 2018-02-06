const handler = require('./handler');

describe('eo', () => {
    it('fork', (done) => {
        handler.consume({
            Records: [
                {
                    kinesis: {
                        data: new Buffer(JSON.stringify({
                            id: '1',
                            type: 'payment-denied',
                            payment: {

                            },
                            context: {
                                order: {
                                    id: '2'
                                },
                                reservation: {

                                },
                            }

                        })).toString('base64')
                    }
                }
            ]
        },
            null,
            (err, res) => {
                console.log(res);
                done(err, res);
            }
        );
    });
});