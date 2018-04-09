import { Loader } from 'calculation-network';
import * as query from './analysis/index';
import * as math from './math';
import storage from './storage';
import * as growth from './growth';
import story from './story.yaml';

const contextNetwork = new Loader({
  ...query,
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
