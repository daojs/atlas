import Promise from 'bluebird';
import client from './mock/worker';

export default {
  parameters: {
    foo: { default: 'foo' },
    bar: { default: 'bar' },
  },
  cells: {
    tic: {
      dependencies: ['@foo', '@bar'],
      factory: (foo, bar) => Promise.delay(1000).then(() => foo + bar),
    },
    tac: {
      dependencies: ['@foo', 'tic'],
      factory: (foo, tic) => Promise.delay(1000).then(() => foo + tic),
    },
    toe: {
      dependencies: ['@bar', 'tac'],
      factory: (bar, tac) => Promise.delay(1000).then(() => bar + tac),
    },
  },
};

client
  .call('mul', 5, 10)
  .then(window.console.log);
