
import { query, query2 } from './analysis/query';
import compile from '../dag-ql';

import storage from './storage';
import * as procedures from './procedures';
import * as simulator from './sodexo-simulator/index-test';
import * as growth from './growth';
import { storyGraph } from './story-graph';

export function dag(graph, result) {
  return compile(graph, {
    query,
    query2,
    read: id => storage.read(id),
    write: data => storage.write(data),
    remove: id => storage.remove(id),
    ...procedures,
    ...simulator,
    ...growth,

  }).get(result);
}

export function get(key) {
  return storyGraph.get(key);
}

export function set(key, value) {
  return storyGraph.set(key, value);
}

export function getInvalidateList(key) {
  return storyGraph.getInvalidateList(key);
}
