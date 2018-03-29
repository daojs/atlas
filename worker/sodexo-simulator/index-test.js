import _ from 'lodash';
import storage from '../storage';
import customersData from '../../simulator-data/data/customers.json';
import rechargeData from '../../simulator-data/data/recharge.json';
import transactionData from '../../simulator-data/data/transaction.json';

function isInTimeRange(timestamp, startDate, endDate) {
  return new Date(timestamp).getTime() < new Date(endDate).getTime() &&
    new Date(timestamp).getTime() > new Date(startDate).getTime();
}

function validate(customerCount) {
  if (customersData.length < customerCount) {
    throw Error('Doesnt have enough data. Please edit the generate-date.js and run npm run data to generage more date');
  }
}
export function simulateRecharge({
  customerCount,
  startDate,
  endDate,
}) {
  validate(customerCount);

  const customers = _.slice(customersData, 0, customerCount);
  const cidsMap = _.invert(_.values(_.map(customers, customer => customer.customerId)));
  const recharge = _.filter(
    rechargeData,
    record => _.has(cidsMap, record.customerId) &&
      isInTimeRange(record.timestamp, startDate, endDate),
  );

  return storage.write(recharge);
}

export function simulateTransaction({
  customerCount,
  startDate,
  endDate,
}) {
  validate(customerCount);

  const customers = _.slice(customersData, 0, customerCount);
  const cidsMap = _.invert(_.values(_.map(customers, customer => customer.customerId)));
  const transaction = _.filter(
    transactionData,
    record => _.has(cidsMap, record.customerId) &&
      isInTimeRange(record.timestamp, startDate, endDate),
  );

  return storage.write(transaction);
}
