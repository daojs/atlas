import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import 'antd/dist/antd.css';
import _ from 'lodash';
import './index.css';
import { SodexoLayout, MasterKongLayout } from './layout';

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
