import storage from '../storage';
import revenueGapData from '../../simulator-data/data/revenue-gap.json';

export function simulateMasterKong() {
  const ret = {
    revenueGap: storage.write(revenueGapData),
  };

  return ret;
}
