import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';
import './index.css';
import BestCustomer from './best-customer/layout';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line
const { Content, Sider } = Layout;
const contentStyle = {
  background: '#f0f2f5',
  padding: 24,
};

const SodexoLayout = () => (
  <Layout>
    <Layout>
      <Sider>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="user" />
            <span className="nav-text">仪表盘</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span className="nav-text">销售额预测</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
        <Content style={contentStyle}>
          <BestCustomer />,
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

const MasterKongLayout = () => (
  <div>图片仅供参考</div>
);

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
