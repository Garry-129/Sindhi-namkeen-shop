import assert from 'node:assert/strict';
import test from 'node:test';
import { mongoSanitize } from './sanitize.js';

test('preserves dotted email values before the downstream handler', () => {
    const req = {
        body: {
            email: 'test@gmail.com',
            value: '$gt',
            $where: 'blocked',
        },
        query: {},
        params: {},
    };
    let downstreamEmail;

    mongoSanitize(req, {}, () => {
        downstreamEmail = req.body.email;
    });

    assert.equal(downstreamEmail, 'test@gmail.com');
    assert.equal(req.body.value, 'gt');
    assert.equal(req.body.where, 'blocked');
});