import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';

const {
  // Bar,
  Compare,
  Cell,
  TimeRange,
  // SingleSelector,
  // PlainData,
  SectionContainer,
  // Donut,
  // LineWithDataZoom,
  SectionCard,
  // HorizontalBar,
} = components;

function WithComponent(Control) {
  return props => <Control {...props} />;
}

export default function () {
  return (<StoryBoard
    components={components}
    story={storyConfig}
    renderComponent={() => (
      <Form>
        <h2 className="master-kong-header">康师傅预测报表</h2>
        <SectionContainer id={storyConfig.id}>
          <div key="slicer">
            <Cell output="@time" label="" renderCell={WithComponent(TimeRange)} />
          </div>
          <SectionCard
            className="overall-analysis"
            key="overallAnalysis"
            title="整体分析"
          >
            整体分析
            <Cell input="masterKongOverallRevenueAndVolumn" subTitle="整体销售额和销量" renderCell={WithComponent(Compare)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
