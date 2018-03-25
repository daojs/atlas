import { query, query2 } from './analysis/query';
import compile from '../dag-ql';
import storage from './storage';

export function dag(graph, result) {
  return compile(graph, {
    query,
    query2,
    read: id => storage.read(id),
  }).get(result);
}
