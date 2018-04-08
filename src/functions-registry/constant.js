import Promise from 'bluebird';

export default function constant(deps, parameters) {
  return Promise.resolve(parameters);
}
