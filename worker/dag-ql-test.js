import { Loader } from 'calculation-network';
import { query, query2 } from './analysis/query';
import * as math from './math';
import storage from './storage';
import * as growth from './growth';
import story from './test-story.yaml';

const contextNetwork = new Loader({
  query,
  query2,
  read: id => storage.read(id),
  write: data => storage.write(data),
  remove: id => storage.remove(id),
  ...growth,
  ...math,
}).load(story);

export async function set(key, value) {
  return (await contextNetwork).set({ [key]: value });
}

export async function get(key) {
  return (await contextNetwork).get(key);
}
