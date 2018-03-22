import ReactDOM from 'react-dom';
import React from 'react';
import 'antd/dist/antd.css';
import _ from 'lodash';
import client from './mock/worker';

import BestCustomer from './best-customer/layout';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line

ReactDOM.render(
  <BestCustomer />,
  document.getElementById('bestcustomer'),
);

client
  .call('simulate', {
    startDate: '2018-01-01',
    endDate: '2018-03-21',
    customerCount: 200,
  })
  .then(({ transaction }) => client.call('reduce', transaction, {
    metrics: [{
      dimension: 'revenue',
      aggregation: 'sum',
    }],
    dimensions: {
      customerId: { type: 'any' },
      timestamp: {
        type: 'months',
        from: '2018-01',
        to: '2018-04',
      },
    },
  }))
  .then(id => client.call('reduce', id, {
    metrics: [{
      dimension: 'revenue',
      aggregation: 'average',
    }],
    dimensions: {
      customerId: { type: 'any' },
    },
  }))
  .then(id => client.call('reduce', id, {
    metrics: [{
      dimension: 'customerId',
      aggregation: 'count',
    }],
    dimensions: {
      revenue: {
        type: 'bins',
        step: 50,
      },
    },
  }))
  .then(id => client.call('read', id))
  .then(window.console.log);
