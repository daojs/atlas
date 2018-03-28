import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import StoryBoard from '../story-board';
import storyConfig from './story';
import components from '../components';

const {
  Bar,
  Cell,
  TimeRange,
  SingleSelector,
  PlainData,
  SectionContainer,
  Donut,
  LineWithDataZoom,
  SectionCard,
  HorizontalBar,
  Heatmap,
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
        <h2>最佳客户分析</h2>
        <SectionContainer id={storyConfig.id}>
          <div key="slicer">
            <Cell output="@time" label="时间范围" renderCell={WithComponent(TimeRange)} />
          </div>
          <SectionCard key="bestUser" title="谁是您的最佳客户">
            <Cell input="measureUser" output="@measureUser" label="指标:" renderCell={WithComponent(SingleSelector)} />
            <Cell input="bestUser" title="Best User SectionCard" renderCell={WithComponent(PlainData)} />
          </SectionCard>
          <SectionCard key="bestCustomer" title="最佳客户的概况">
            <Cell input="measureCustomer" output="@measureCustomer" label="指标:" renderCell={WithComponent(SingleSelector)} />
            <Cell input="bestCustomerQuery" title="Best Customer Query" renderCell={WithComponent(PlainData)} />
            <Cell input="bestCustomerTSAD" title="基于时间片的异常点分析" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="bestCustomerExpensePerUser" title="最佳客户的消费情况">
            <Cell input="granularityCustomer" output="@granularityCustomer" label="粒度" renderCell={WithComponent(SingleSelector)} />
            <Cell input="customerExpensePerUserBucket" title="单个客户的消费区间" renderCell={WithComponent(Bar)} />
            <Cell input="customerExpensePerUserRank" title="单个客户的异常点分析" renderCell={WithComponent(HorizontalBar)} />
          </SectionCard>
          <SectionCard key="favor" title="最佳客户的喜好">
            <Cell input="measureFavor" output="@measureFavor" label="指标:" renderCell={WithComponent(SingleSelector)} />
            <Cell input="dimensionFavor" output="@dimensionFavor" label="维度:" renderCell={WithComponent(SingleSelector)} />
            <Cell input="favorBestCustomerReduce" title="喜好的比例" renderCell={WithComponent(Donut)} />
            <Cell input="favorBestCustomerTrend" title="喜好的变化趋势" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="mealCard" title="餐卡的使用情况">
            <Cell input="usageMealCardReduce" subTitle="餐卡的使用比例" renderCell={WithComponent(Donut)} />
            <Cell input="usageMealCardBucketCRAP" title="单个客户的餐卡充值金额" renderCell={WithComponent(Bar)} />
            <Cell input="usageMealCardQuery" title="Usage of Meal SectionCard Query" renderCell={WithComponent(PlainData)} />
            <Cell input="usageMealCardBucketCB" title="Usage of Meal SectionCard CardBalance" renderCell={WithComponent(PlainData)} />
          </SectionCard>
          <SectionCard key="growthAbility" title="增长能力">
            <Cell input="measureGrowth" output="@measureGrowth" label="指标:" renderCell={WithComponent(SingleSelector)} />
            <Cell input="growthAbilityCumulative" subTitle="Growth Ability Cumulative" renderCell={WithComponent(LineWithDataZoom)} />
            <Cell input="growthAbilityGrowthRate" subTitle="Growth Ability Growth Rate" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="retension" title="留存率">
            <Cell input="retension" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
