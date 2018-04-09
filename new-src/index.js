import ReactDOM from 'react-dom';
import React from 'react';
import echarts from 'echarts';
import 'antd/dist/antd.css';
import _ from 'lodash';
import './index.css';
import Layout from './ui/layout';
import daoTheme1 from './assets/DaoTheme1.json';

echarts.registerTheme('theme1', daoTheme1);

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line

ReactDOM.render(
  (
    <Layout />
  ), document.getElementById('bestcustomer'),
);
