const _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid/v4');
const constants = require('./constants.json');
const fs = require('fs');

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
      ({ serves }) => _.includes(serves, period),
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
  const branch = _.sample(branches);

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
    branchName: branch.name,
    skuType: _.sample(branch.dishes).name,
  };
}

function simulateRecharge({ time, customer }, recharge) {
  const amount = _.sample(rechargeAmount);

  _.extend(customer, {
    balance: customer.balance + amount,
  });
  

  recharge.push(_.defaults({
    rechargeId: uuid(),
    timestamp: time.toISOString(),
    channel: channels[1],
    rechargeAmount: amount,
  }, customer));
}

function simulateAllowance({ day, customer }, recharge) {
  const time = day.clone().add(9, 'hour');

  _.extend(customer, {
    balance: customer.balance + allowanceAmount,
  });

  recharge.push(_.defaults({
    rechargeId: uuid(),
    timestamp: time.toISOString(),
    channel: channels[0],
    rechargeAmount: allowanceAmount,
  }));
}

function simulateMeal({
  meal,
  startTime,
  duration,
}) {
  return ({ day, customer }, { recharge, transaction }) => {
    const branch = _.sample(servingBranches[meal]);
    const dish = _.sample(branch.dishes);
    const time = day.clone().add(startTime, 'hour');

    time.add(_.random(true) * duration, 'hour');
    if (customer.balance < dish.price) {
      simulateRecharge({ time, customer }, recharge);
      time.add(_.random(5, true), 'minute');
    }

    _.extend(customer, {
      balance: customer.balance - dish.price,
    });

    transaction.push(_.defaults({
      transactionId: uuid(),
      meal,
      timestamp: time.toISOString(),
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

function generageAndSaveData(startDate, endDate, customerCount) {
  const customers = _.times(customerCount, createCustomer);
  const recharge = [];
  const transaction = [];

  forDays(startDate, endDate, (day) => {
    _.forEach(customers, (customer) => {
      const { customerId } = customer;

      if (day.date === allowanceDate && customer.cardType === cardTypes[0]) {
        simulateAllowance({ day, customer });
      }

      if (_.random(true) < pMeals.breakfast[customerId]) {
        simulateBreakfast({ day, customer }, { recharge, transaction });
      }
      if (_.random(true) < pMeals.lunch[customerId]) {
        simulateLunch({ day, customer }, { recharge, transaction });
      }
      if (_.random(true) < pMeals.dinner[customerId]) {
        simulateDinner({ day, customer }, { recharge, transaction });
      }
    });
  });

  fs.writeFile('./data/customers.json', JSON.stringify(customers));
  fs.writeFile('./data/recharge.json', JSON.stringify(recharge));
  fs.writeFile('./data/transaction.json', JSON.stringify(transaction));
}

generageAndSaveData('2018-01-01', '2018-03-31', 200);

