import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../story-board';
import storyConfig from './story';
import components from '../components';

const {
  Cell,
  TimeRange,
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
        <SectionContainer id={storyConfig.id}>
          <SectionCard key="slicer">
            <Cell output="@time" label="时间: " renderCell={WithComponent(TimeRange)} />
            <Cell input="metric" output="@metric" label="指标: " renderCell={WithComponent(SingleSelector)} />
            <Cell input="dimension" output="@dimension" label="维度: " renderCell={WithComponent(SingleSelector)} />
            <Cell input="granularity" output="@granularity" label="Granularity: " renderCell={WithComponent(SingleSelector)} />
            <Cell input="branch" output="@branch" label="Branch Name:" renderCell={WithComponent(SingleSelector)} />
          </SectionCard>
          <SectionCard key="metricTrend" title="指标情况及预测">
            <Cell input="fetchMetricTrend" renderCell={WithComponent(LineWithDataZoom)} />
            <Cell input="metricCumulative" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="goalBreakDown" title="你可以这么做">
            <Cell input="usageGoalBreakDown" title="分解目标" renderCell={WithComponent(HorizontalBar)} />
            <Cell input="usageGoalAchieve" title="实现目标" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
