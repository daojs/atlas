import data from '../../simulator-data/master-kong/data/forecast.json';
import storage from '../storage';

export function masterKongSimulate() {
  return {
    forecast: storage.write(data),
  };
}
