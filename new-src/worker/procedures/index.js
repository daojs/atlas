import storage from './storage';

export * from './analysis';
export * from './math';
export * from './growth';

export const read = id => storage.read(id);
export const write = data => storage.write(data);
export const remove = id => storage.remove(id);
