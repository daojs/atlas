import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import echarts from 'echarts';
import 'antd/dist/antd.css';
import _ from 'lodash';
import './index.css';
import SodexoLayout from './layout';
import MasterKongLayout from './master-kong';
import daoTheme1 from './assets/DaoTheme1.json';

echarts.registerTheme('theme1', daoTheme1);

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line

ReactDOM.render(
  (
    <HashRouter >
      <Switch>
        <Route path="/sodexo" component={SodexoLayout} />
        <Route path="/masterkong" component={MasterKongLayout} />
        <Route component={SodexoLayout} />
      </Switch>
    </HashRouter >
  ), document.getElementById('bestcustomer'),
);
