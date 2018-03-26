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
        <h2>Best User Analysis</h2>
        <SectionContainer id={storyConfig.id}>
          <div key="slicer">
            <Cell output="@time" label="Time Range" renderCell={WithComponent(TimeRange)} />
          </div>
          <SectionCard key="bestUser" title="Best User Analysis of xxx">
            <Cell input="measureUser" output="@measureUser" label="Measure" renderCell={WithComponent(SingleSelector)} />
            <Cell input="bestUser" title="Best User SectionCard" renderCell={WithComponent(PlainData)} />
          </SectionCard>
          <SectionCard key="bestCustomer" title="Best Customer Overview">
            <Cell input="measureCustomer" output="@measureCustomer" label="Measure" renderCell={WithComponent(SingleSelector)} />
            <Cell input="bestCustomerQuery" title="Best Customer Query" renderCell={WithComponent(PlainData)} />
            <Cell input="bestCustomerTSAD" title="Best Customer TSAD" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="bestCustomerExpensePerUser" title="Best Customer Expense Per User">
            <Cell input="granularityCustomer" output="@granularityCustomer" label="Granularity" renderCell={WithComponent(SingleSelector)} />
            <Cell input="customerExpensePerUserBucket" title="Best Customer Expense Per User Bucket" renderCell={WithComponent(Bar)} />
            <Cell input="customerExpensePerUserRank" title="Best Customer Expense Per User TSAD" renderCell={WithComponent(HorizontalBar)} />
          </SectionCard>
          <SectionCard key="favor" title="Favor XXX of Best Customers">
            <Cell input="measureFavor" output="@measureFavor" label="Measure" renderCell={WithComponent(SingleSelector)} />
            <Cell input="dimensionFavor" output="@dimensionFavor" label="Dimension" renderCell={WithComponent(SingleSelector)} />
            <Cell input="favorBestCustomerReduce" title="Favor Best Customer Reduce" renderCell={WithComponent(Donut)} />
            <Cell input="favorBestCustomerTrend" title="Favor Customer Trend" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="mealCard" title="Usage of Meal SectionCard">
            <Cell input="usageMealCardReduce" subTitle="Usage of Meal SectionCard Reduce" renderCell={WithComponent(Donut)} />
            <Cell input="usageMealCardBucketCRAP" title="Usage of Meal SectionCard Bucket CardRechargeAmountPerUU" renderCell={WithComponent(Bar)} />
            <Cell input="usageMealCardQuery" title="Usage of Meal SectionCard Query" renderCell={WithComponent(PlainData)} />
            <Cell input="usageMealCardBucketCB" title="Usage of Meal SectionCard CardBalance" renderCell={WithComponent(PlainData)} />
          </SectionCard>
          <SectionCard key="growthAbility" title="Growth Ability">
            <Cell input="measureGrowth" output="@measureGrowth" label="Measure" renderCell={WithComponent(SingleSelector)} />
            <Cell input="growthAbilityCumulative" subTitle="Growth Ability Cumulative" renderCell={WithComponent(LineWithDataZoom)} />
            <Cell input="growthAbilityGrowthRate" subTitle="Growth Ability Growth Rate" renderCell={WithComponent(LineWithDataZoom)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
