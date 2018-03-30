import { Loader } from 'calculation-network';
import { query, query2 } from './analysis/query';
import compile from '../dag-ql';

import storage from './storage';
import * as procedures from './procedures';
import * as simulator from './sodexo-simulator/index-test';
import * as growth from './growth';
// import { storyGraph } from './story-graph';
import story from './test-story.yaml';

const cn = Loader({
  query,
  query2,
  read: id => storage.read(id),
  write: data => storage.write(data),
  remove: id => storage.remove(id),
  ...growth,
}).load(story);

export function set(key, value) {
  return cn.set({ [key]: value });
}

export function get(key, value) {
  return cn.get(key);
}
