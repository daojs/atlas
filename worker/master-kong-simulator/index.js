import data from '../../simulator-data/master-kong/data/forcast.json';
import revenueGapData from '../../simulator-data/data/revenue-gap.json';
import storage from '../storage';

export function masterKongSimulate() {
  return {
    forcast: storage.write(data),
  };
}

export function simulateMasterKong() {
  return {
    revenueGap: storage.write(revenueGapData),
  };
}
