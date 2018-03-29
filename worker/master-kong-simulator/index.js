import data from '../../simulator-data/master-kong/data/forcast.json';
import storage from '../storage';

export function masterKongSimulate() {
  return storage.write(data);
}
