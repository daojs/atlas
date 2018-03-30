import data from '../../simulator-data/master-kong/data/forecast.json';
import datav2 from '../../simulator-data/master-kong/data/forecast-v2.json';
import salesCountTSAD from '../../simulator-data/master-kong/data/sales-count-tsad.json';
import storage from '../storage';

export function masterKongSimulate() {
  return {
    forecast: storage.write(data),
    forecastv2: storage.write(datav2),
    salesCountTSAD: storage.write(salesCountTSAD),
  };
}
