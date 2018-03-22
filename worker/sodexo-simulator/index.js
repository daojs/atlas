import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';
import Logger from './logger';
import constants from './constants.json';

const {
  branches,
  disciplines,
  departments,
  genders,
  channels,
  cardTypes,
  rechargeAmount,
  allowanceDate,
  allowanceAmount,
} = constants;

const ages = _.range(22, 45);
const meals = [
  'breakfast',
  'lunch',
  'dinner',
];
const servingBranches = _.zipObject(
  meals,
  _.map(
    meals,
    period => _.filter(
      branches,
      ({ serves }) => _.includes(serves, period)
    ),
  ),
);

function forDays(startDate, endDate, iteratee) {
  const momentStart = moment(startDate).startOf('day');
  const momentEnd = moment(endDate).startOf('day');
  let day = momentStart;
  while (day.isBefore(momentEnd)) {
    iteratee(day);
    day = day.add(1, 'day');
  }
}

const pMeals = {
  breakfast: {},
  lunch: {},
  dinner: {},
};

function createCustomer() {
  const cardType = _.sample(cardTypes);
  const customerId = uuid();

  pMeals.breakfast[customerId] = _.random(0.2, true);
  pMeals.lunch[customerId] = _.random(0.8, true);
  pMeals.dinner[customerId] = _.random(0.3, true);

  return {
    customerId,
    department: _.sample(departments),
    discipline: _.sample(disciplines),
    gender: _.sample(genders),
    age: _.sample(ages),
    cardType,
    balance: cardType === cardTypes[0] ? allowanceAmount : _.sample(rechargeAmount),
  };
}

function simulateRecharge({ time, customer }, logger) {
  const amount = _.sample(rechargeAmount);

  _.extend(customer, {
    balance: customer.balance + amount,
  });

  logger.log('recharge', _.defaults({
    timestamp: time.toString(),
    channel: channels[1],
    rechargeAmount: amount,
  }, customer));
}

function simulateAllowance({ day, customer }, logger) {
  const time = day.clone().add(9, 'hour');

  _.extend(customer, {
    balance: customer.balance + allowanceAmount,
  });

  logger.log('recharge', _.defaults({
    timestamp: time.toString(),
    channel: channels[0],
    rechargeAmount: allowanceAmount,
  }));
}

function simulateMeal({
  meal,
  startTime,
  duration,
}) {
  return ({ day, customer }, logger) => {
    const branch = _.sample(servingBranches[meal]);
    const dish = _.sample(branch.dishes);
    const time = day.clone().add(startTime, 'hour');

    time.add(_.random(true) * duration, 'hour');
    if (customer.balance < dish.price) {
      simulateRecharge({ time, customer }, logger);
      time.add(_.random(5, true), 'minute');
    }

    _.extend(customer, {
      balance: customer.balance - dish.price,
    });

    logger.log('transaction', _.defaults({
      meal,
      timestamp: time.toString(),
      branch: branch.name,
      dish: dish.name,
      revenue: dish.price,
    }, customer));
  };
}

const simulateBreakfast = simulateMeal({
  meal: 'breakfast',
  startTime: 8.5,
  duration: 1,
});


const simulateLunch = simulateMeal({
  meal: 'lunch',
  startTime: 11.5,
  duration: 2,
});

const simulateDinner = simulateMeal({
  meal: 'dinner',
  startTime: 17.5,
  duration: 1.5,
});

export function simulate({
  customerCount,
  startDate,
  endDate,
}) {
  const customers = _.times(customerCount, createCustomer);

  return Logger.record((logger) => {
    forDays(startDate, endDate, (day) => {
      _.forEach(customers, (customer) => {
        const { customerId } = customer;

        if (day.date === allowanceDate && customer.cardType === cardTypes[0]) {
          simulateAllowance({ day, customer }, logger);
        }

        if (_.random(true) < pMeals.breakfast[customerId]) {
          simulateBreakfast({ day, customer }, logger);
        }
        if (_.random(true) < pMeals.lunch[customerId]) {
          simulateLunch({ day, customer }, logger);
        }
        if (_.random(true) < pMeals.dinner[customerId]) {
          simulateDinner({ day, customer }, logger);
        }
      });
    });
  });
}

export function readLog(id) {
  return Logger.read(id);
}

export function removeLog(id) {
  Logger.remove(id);
}
