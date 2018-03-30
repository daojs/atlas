import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

// import BestDescription from './best-description';
import './index.css';
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
        <h2 className="best-customer-header">客户分析</h2>
        <SectionContainer id="10001">
          <div key="slicer">
            <Cell output="@time" label="" renderCell={WithComponent(TimeRange)} />
          </div>
          <SectionCard key="bestCustomer" title="概况" extra={<Cell input="measureCustomer" output="@measureCustomer" label="Measure" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="bestCustomerQuery" title="Best Customer Query" renderCell={WithComponent(PlainData)} />
            <Cell input="bestCustomerTSAD" title="基于时间片的异常点分析" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="bestCustomerExpensePerUser" title="消费情况分析" extra={<Cell input="granularityCustomer" output="@granularityCustomer" label="Granularity" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="customerExpensePerUserBucket" title="平均消费分布" renderCell={WithComponent(Bar)} />
            <Cell input="customerExpensePerUserRank" title="单个客户的消费排名" renderCell={WithComponent(HorizontalBar)} />
          </SectionCard>
          <SectionCard
            className="favor-best-customer"
            key="favor"
            title="偏好分析"
            extra={
              <span className="radio-selector">
                <Cell style={{ display: 'inline-block' }} input="measureFavor" output="@measureFavor" label="Measure" renderCell={WithComponent(SingleSelector)} />
                <Cell style={{ display: 'inline-block' }} input="dimensionFavor" output="@dimensionFavor" label="Dimension" renderCell={WithComponent(SingleSelector)} />
              </span>}
          >
            <Cell input="favorBestCustomerReduce" title="喜好的比例" renderCell={WithComponent(Donut)} />
            <Cell input="favorBestCustomerTrend" title="喜好的变化趋势" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="mealCard" title="餐卡的使用情况">
            <Cell input="usageMealCardReduce" subTitle="餐卡的使用比例" renderCell={WithComponent(Donut)} />
            <Cell input="usageMealCardBucketCRAP" title="单个客户的餐卡充值金额" renderCell={WithComponent(Bar)} />
            <Cell input="usageMealCardQuery" title="Usage of Meal SectionCard Query" renderCell={WithComponent(PlainData)} />
            <Cell input="usageMealCardBucketCB" title="Usage of Meal SectionCard CardBalance" renderCell={WithComponent(PlainData)} />
          </SectionCard>
          <SectionCard key="activeness" title="活跃度" extra={<Cell input="measureActiveness" output="@measureActiveness" label="指标:" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="activenessTraffic" subTitle="Activeness Traffic" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="growthAbility" title="增长能力" extra={<Cell input="measureGrowth" output="@measureGrowth" label="指标:" renderCell={WithComponent(SingleSelector)} />}>
            <Cell input="growthAbilityCumulative" subTitle="Growth Ability Cumulative" renderCell={WithComponent(LineWithDataZoom)} />
            <Cell input="growthAbilityGrowthRate" subTitle="Growth Ability Growth Rate" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
