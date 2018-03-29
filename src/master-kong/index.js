import React from 'react';
import { Layout, Menu, Icon } from 'antd';

import MasterKongDashBoard from './dashboard/layout';
import MasterKongInsight from './insight/layout';

const { Content, Sider } = Layout;
const contentStyle = {
  background: '#f0f2f5',
  padding: 24,
};

const MasterKongContent = {
  dashboard: MasterKongDashBoard,
  insight: MasterKongInsight,
};

export default class MasterKongLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'dashboard',
    };
  }

  onSelectMenu = ({ key }) => { this.setState({ selected: key }); }

  render() {
    const Control = MasterKongContent[this.state.selected] || MasterKongDashBoard;

    return (
      <Layout>
        <Layout>
          <Sider>
            <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" onSelect={this.onSelectMenu}>
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
