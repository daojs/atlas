import Promise from 'bluebird';

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
