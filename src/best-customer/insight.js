import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../story-board';
import storyConfig from './insight.config';
import components from '../components';

const {
  Cell,
  SingleSelector,
  SectionContainer,
  LineWithDataZoom,
  SectionCard,
  HorizontalBar,
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
        <SectionContainer id="10002">
          <SectionCard key="metricTrend" title="指标情况及预测">
            <Cell input="usageMetricTrend" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="mealName" title="餐点销售额预测" extra={<Cell input="mealName" output="@mealName" label="Meal Name" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="usageRevenueForecastByMeal" title="分解目标" renderCell={WithComponent(HorizontalBar)} />
          </SectionCard>
          <SectionCard key="branchName" title="餐厅销售额预测" extra={<Cell input="branch" output="@branch" label="Branch Name" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="usageRevenueForecastByBranch" title="分解目标" renderCell={WithComponent(HorizontalBar)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
