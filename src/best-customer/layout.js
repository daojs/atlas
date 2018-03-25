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

function WithChart(Control) {
  return props => <Control {...props.value} {...props} />; //eslint-disable-line
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
            <Cell output="@time" label="Time Range" renderCell={WithChart(TimeRange)} />
          </div>
          <SectionCard key="bestUser" title="Best User">
            <Cell input="measureUser" output="@measureUser" label="Measure" renderCell={WithChart(SingleSelector)} />
            <Cell input="bestUser" title="Best User SectionCard" renderCell={WithChart(PlainData)} />
          </SectionCard>
          <SectionCard key="bestCustomer" title="Best Customer Overview">
            <Cell input="measureCustomer" output="@measureCustomer" label="Measure" renderCell={WithChart(SingleSelector)} />
            <Cell input="bestCustomerQuery" title="Best Customer Query" renderCell={WithChart(PlainData)} />
            <Cell input="bestCustomerTSAD" title="Best Customer TSAD" renderCell={WithChart(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="bestCustomerExpensePerUser" title="Best Customer Expense Per User">
            <Cell input="granularityCustomer" output="@granularityCustomer" label="Granularity" renderCell={WithChart(SingleSelector)} />
            <Cell input="customerExpensePerUserBucket" title="Best Customer Expense Per User Bucket" renderCell={WithChart(Bar)} />
            <Cell input="customerExpensePerUserRank" title="Best Customer Expense Per User TSAD" renderCell={WithChart(HorizontalBar)} />
          </SectionCard>
          <SectionCard key="favor" title="Favor XXX of Best Customers">
            <Cell input="measureFavor" output="@measureFavor" label="Measure" renderCell={WithChart(SingleSelector)} />
            <Cell input="dimensionFavor" output="@dimensionFavor" label="Dimension" renderCell={WithChart(SingleSelector)} />
            <Cell input="favorBestCustomerReduce" title="Favor Best Customer Reduce" renderCell={WithChart(Donut)} />
            <Cell input="favorBestCustomerTrend" title="Favor Customer Trend" renderCell={WithChart(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="mealCard" title="Usage of Meal SectionCard">
            <Cell input="usageMealCardReduce" subTitle="Usage of Meal SectionCard Reduce" renderCell={WithChart(Donut)} />
            <Cell input="usageMealCardBucketCRAP" title="Usage of Meal SectionCard Bucket CardRechargeAmountPerUU" renderCell={WithChart(Bar)} />
            <Cell input="usageMealCardQuery" title="Usage of Meal SectionCard Query" renderCell={WithChart(PlainData)} />
            <Cell input="usageMealCardBucketCB" title="Usage of Meal SectionCard CardBalance" renderCell={WithChart(PlainData)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
