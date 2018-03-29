import _ from 'lodash';
import data from '../../simulator-data/master-kong/generate-forcast-data';
import storage from '../storage';

export function masterKongSimulate() {
  return storage.write(data);
}
