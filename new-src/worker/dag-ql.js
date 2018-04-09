import { Loader } from 'calculation-network';
import * as procedures from './procedures';
import story from './story.yaml';

const contextNetwork = new Loader({
  ...procedures,
}).load(story);

export async function set(key, value) {
  return (await contextNetwork).set({ [key]: value });
}

export async function get(key) {
  return (await contextNetwork).get(key);
}
