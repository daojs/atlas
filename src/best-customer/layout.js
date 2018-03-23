import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import StoryBoard from '../story-board';
import storyConfig from './story';
import components from '../components';

const {
  Cell,
  TimeRange,
  SingleSelector,
  PlainData,
  SectionContainer,
  Donut,
  LineWithDataZoom,
  SectionCard,
} = components;

function WithLabel(Control, label) {
  return props => <Control label={label} {...props} />;
}

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
            <Cell output="@time" renderCell={WithLabel(TimeRange, 'Time Range')} />
          </div>
          <SectionCard key="bestUser" title="Best User">
            <Cell input="measureUser" output="@measureUser" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestUser" title="Best User SectionCard" renderCell={WithChart(PlainData)} />
          </SectionCard>
          <SectionCard key="bestCustomer" title="Best Customer Overview">
            <Cell input="measureCustomer" output="@measureCustomer" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestCustomerQuery" title="Best Customer Query" renderCell={WithChart(PlainData)} />
            <Cell input="bestCustomerTSAD" title="Best Customer TSAD" renderCell={WithChart(LineWithDataZoom)} />
          </SectionCard>
          <SectionCard key="bestCustomerExpensePerUser" title="Best Customer Expense Per User">
            <Cell input="granularityCustomer" output="@granularityCustomer" renderCell={WithLabel(SingleSelector, 'Granularity')} />
            <Cell input="customerExpensePerUserBucket" title="Best Customer Expense Per User Bucket" renderCell={WithChart(PlainData)} />
            <Cell input="customerExpensePerUserRank" title="Best Customer Expense Per User TSAD" renderCell={WithChart(PlainData)} />
          </SectionCard>
          <SectionCard key="favor" title="Favor XXX of Best Customers">
            <Cell input="measureFavor" output="@measureFavor" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="dimensionFavor" output="@dimensionFavor" renderCell={WithLabel(SingleSelector, 'Dimension')} />
            <Cell input="favorBestCustomerReduce" title="Favor Best Customer Reduce" renderCell={WithChart(PlainData)} />
            <Cell input="favorBestCustomerTrend" title="Favor Customer Trend" renderCell={WithChart(PlainData)} />
          </SectionCard>
          <SectionCard key="mealCard" title="Usage of Meal SectionCard">
            <Cell input="usageMealCardReduce" subTitle="Usage of Meal SectionCard Reduce" renderCell={WithChart(Donut)} />
            <Cell input="usageMealCardBucketCRAP" title="Usage of Meal SectionCard Bucket CardRechargeAmountPerUU" renderCell={WithChart(PlainData)} />
            <Cell input="usageMealCardQuery" title="Usage of Meal SectionCard Query" renderCell={WithChart(PlainData)} />
            <Cell input="usageMealCardBucketCB" title="Usage of Meal SectionCard CardBalance" renderCell={WithChart(PlainData)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
