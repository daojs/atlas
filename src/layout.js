import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import BestCustomer from './best-customer/layout';
import SodexoInsight from './best-customer/insight';

const { Content, Sider } = Layout;
const contentStyle = {
  background: '#f0f2f5',
  padding: 24,
};

const SodexContent = {
  dashboard: BestCustomer,
  insight: SodexoInsight,
};

export default class SodexoLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'dashboard',
    };
  }
  render() {
    const Control = SodexContent[this.state.selected] || BestCustomer;
    return (
      <Layout>
        <Layout>
          <Sider>
            <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" onSelect={({ key }) => { this.setState({ selected: key }); }}>
              <Menu.Item key="dashboard">
                <Icon type="user" />
                <span className="nav-text">仪表盘</span>
              </Menu.Item>
              <Menu.Item key="insight">
                <Icon type="video-camera" />
                <span className="nav-text">销售额预测</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
            <Content style={contentStyle}>
              <Control />,
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
