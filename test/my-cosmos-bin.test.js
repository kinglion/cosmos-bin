'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');

describe('test/my-cosmos-bin.test.js', () => {
    const cosmosBin = require.resolve('./fixtures/my-cosmos-bin/bin/my-cosmos-bin.js');
    const cwd = path.join(__dirname, 'fixtures/test-files');

    afterEach(mm.restore);

    it('should my-cosmos-bin test success', done => {
        mm(process.env, 'TESTS', 'test/**/*.test.js');
        coffee.fork(cosmosBin, [ 'test' ], { cwd })
            .debug()
            .expect('stdout', /should success/)
            .expect('stdout', /a.test.js/)
            .expect('stdout', /b\/b.test.js/)
            .notExpect('stdout', /a.js/)
            .expect('code', 0)
            .end(done);
    });
});