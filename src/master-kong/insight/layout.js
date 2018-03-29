import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';
import Usage from './usage-metric-trend-chart';

const {
  Bar,
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
  // StackBar,
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
            <Cell input="revenueBreakDownByBranch" title="预测销售额与目标销售额对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="volumeBreakDownByBranch" title="预测销量与目标销量对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="revenueGapPerCategory" title="各类商品销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-category"
            title="指定产品"
            extra={<Cell input="category" output="@category" renderCell={WithComponent(DropdownSelector)} />}
          >
            <Cell input="revenueBreakDownByCategory" title="预测销售额与目标销售额对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="volumeBreakDownByCategory" title="预测销量与目标销量对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="revenueGapPerBranch" title="各地区销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
