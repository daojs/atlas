import data from '../../simulator-data/master-kong/data/forcast.json';
import storage from '../storage';

export function masterKongSimulate() {
  return {
    forcast: storage.write(data),
  };
}
