import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';

const {
  // Bar,
  // Compare,
  Cell,
  Heatmap,
  TimeRange,
  SingleSelector,
  // PlainData,
  SectionContainer,
  // Donut,
  // LineWithDataZoom,
  SectionCard,
  StackBar,
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
        <SectionContainer id="20000">
          <div key="slicer">
            <Cell output="@time" label="" renderCell={WithComponent(TimeRange)} />
          </div>
          <SectionCard
            className="overall-analysis"
            key="given-branch"
            title="指定行销部门"
            extra={<Cell input="branch" output="@branch" label="行销部门:" renderCell={WithComponent(SingleSelector)} />}
          >
            <Cell input="masterKongRevenueGapPerBranchMonth" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-category"
            title="指定大类"
            extra={<Cell input="category" output="@category" label="大类:" renderCell={WithComponent(SingleSelector)} />}
          >
            <Cell input="masterKongRevenueGapPerBranchMonth" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
          <SectionCard key="goalBreakDown" title="你可以这么做">
            <Cell input="revenueBreakDownByTime" title="按营业额分解目标" renderCell={WithComponent(StackBar)} />
            <Cell input="amountBreakDownByTime" title="按销量分解目标" renderCell={WithComponent(StackBar)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-category-bar"
            title="指定大类"
            extra={<Cell input="category" output="@category" label="大类:" renderCell={WithComponent(SingleSelector)} />}
          >
            <Cell input="revenueBreakDownByCategory" subTitle="差距" renderCell={WithComponent(StackBar)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
