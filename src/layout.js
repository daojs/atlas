import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import BestCustomer from './best-customer/layout';
import MasterKongDashBoard from './master-kong/layout';

const { Content, Sider } = Layout;
const contentStyle = {
  background: '#f0f2f5',
  padding: 24,
};

export const SodexoLayout = () => (
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

export const MasterKongLayout = () => (
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
          <MasterKongDashBoard />,
        </Content>
      </Layout>
    </Layout>
  </Layout>
);
