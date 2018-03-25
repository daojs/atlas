const procedures = {};

onmessage = function handler(event) {
  const [id, name, ...parameters] = event.data;

  function reject(message) {
    postMessage([id, message, null]);
  }

  function resolve(value) {
    Promise.resolve(value)
      .then(result => postMessage([id, null, result]))
      .catch(error => reject(error.message));
  }

  if (typeof id !== 'string') {
    return reject(`Invalid procedure call id "${id}"`);
  }

  if (typeof name !== 'string') {
    return reject(`Invalid prodedure name "${name}"`);
  }

  if (typeof procedures[name] !== 'function') {
    return reject(`Procedure "${name}" is not defined`);
  }

  try {
    return resolve(procedures[name].apply(null, parameters));
  } catch (e) {
    reject(`Procedure call failed with "${e.message}"`);
    throw e;
  }
};

export default function register(funcs) {
  Object.assign(procedures, funcs);
}
