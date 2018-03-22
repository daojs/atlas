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
} = components;

function WithLabel(Control, label) {
  return props => <Control label={label} {...props} />;
}

export default function () {
  return (<StoryBoard
    components={components}
    story={storyConfig}
    renderComponent={() => (
      <Form>
        <h2>Best User Analysis</h2>
        <Cell output="@time" renderCell={WithLabel(TimeRange, 'Time Range')} />
        <SectionContainer id={storyConfig.id}>
          <div key="bestUser">
            <Cell input="measureUser" output="@measureUser" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestUser" renderCell={WithLabel(PlainData, 'Best User Card')} />
          </div>
          <div key="bestCustomer">
            <h2>Best Customer Overview</h2>
            <Cell input="measureCustomer" output="@measureCustomer" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestCustomerQuery" renderCell={WithLabel(PlainData, 'Best Customer Query')} />
            <Cell input="bestCustomerTSAD" renderCell={WithLabel(PlainData, 'Best Customer TSAD')} />
          </div>
          <div key="bestCustomerExpensePerUser">
            <h2>Best Customer Expense Per User</h2>
            <Cell input="granularityCustomer" output="@granularityCustomer" renderCell={WithLabel(SingleSelector, 'Granularity')} />
            <Cell input="customerExpensePerUserBucket" renderCell={WithLabel(PlainData, 'Best Customer Expense Per User Bucket')} />
            <Cell input="customerExpensePerUserRank" renderCell={WithLabel(PlainData, 'Best Customer Expense Per User TSAD')} />
          </div>
          <div key="favor">
            <h2>Favor XXX of Best Customers</h2>
            <Cell input="measureFavor" output="@measureFavor" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="dimensionFavor" output="@dimensionFavor" renderCell={WithLabel(SingleSelector, 'Dimension')} />
            <Cell input="favorBestCustomerReduce" renderCell={WithLabel(PlainData, 'Favor Best Customer Reduce')} />
            <Cell input="favorBestCustomerTrend" renderCell={WithLabel(PlainData, 'Favor Customer Trend')} />
          </div>
          <div key="mealCard">
            <h2>Usage of Meal Card</h2>
            <Cell input="usageMealCardReduce" renderCell={WithLabel(PlainData, 'Usage of Meal Card Reduce')} />
            <Cell input="usageMealCardBucketCRAP" renderCell={WithLabel(PlainData, 'Usage of Meal Card Bucket CardRechargeAmountPerUU')} />
            <Cell input="usageMealCardQuery" renderCell={WithLabel(PlainData, 'Usage of Meal Card Query')} />
            <Cell input="usageMealCardBucketCB" renderCell={WithLabel(PlainData, 'Usage of Meal Card CardBalance')} />
          </div>
        </SectionContainer>
      </Form>
    )}
  />);
}
