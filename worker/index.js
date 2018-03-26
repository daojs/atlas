import register from './rpc-server';
import * as procedures from './procedures';
import * as simulator from './sodexo-simulator';
import * as analysis from './analysis';
import storage from './storage';
import * as dagQL from './dag-ql';
import * as growth from './growth';

register(procedures);
register(simulator);
register(analysis);
register({
  write: data => storage.write(data),
  read: id => storage.read(id),
  remove: id => storage.remove(id),
});

register(dagQL);
register(growth);
