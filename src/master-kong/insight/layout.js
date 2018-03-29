import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';
import Usage from './usage-metric-trend-chart';

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
  // Line,
  SectionCard,
  StackBar,
} = components;

function WithComponent(Control) {
  return props => <Control {...props} />;
}

const DropdownSelector = props => <SingleSelector selectType="select" {...props} />;

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
            key="revenue-predicate"
            title="总体销售额预测"
            extra={<span>h1</span>}
          >
            <Cell renderCell={WithComponent(Usage)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-branch"
            title="指定行销部门"
            extra={<Cell input="branch" output="@branch" renderCell={WithComponent(DropdownSelector)} />}
          >
            <Cell input="revenueGapPerCategory" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-category"
            title="指定大类"
            extra={<Cell input="category" output="@category" renderCell={WithComponent(DropdownSelector)} />}
          >
            <Cell input="revenueGapPerBranch" subTitle="差距" renderCell={WithComponent(Heatmap)} />
            <Cell input="revenueBreakDownByCategory" subTitle="差距" renderCell={WithComponent(StackBar)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
