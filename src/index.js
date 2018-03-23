import ReactDOM from 'react-dom';
import React from 'react';
import 'antd/dist/antd.css';
import _ from 'lodash';
import './index.css';

import BestCustomer from './best-customer/layout';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line

ReactDOM.render(
  <BestCustomer />,
  document.getElementById('bestcustomer'),
);
