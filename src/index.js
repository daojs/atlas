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
  .call('mul', 5, 10)
  .then(window.console.log);

client
  .call('simulate', {
    startDate: '2018-01-01',
    endDate: '2018-03-21',
    customerCount: 1,
  })
  .then(id => client.call('readLog', id))
  .then(window.console.log);
