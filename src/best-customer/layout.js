import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import StoryBoard from '../story-board';
import sampleStory from './story';
import components from '../components';

const {
  Data,
  TimeRange,
  SingleSelector,
  Card,
} = components;

function WithLabel(Control, label) {
  return props => <Control label={label} {...props} />;
}

export default function () {
  return (<StoryBoard
    components={components}
    story={sampleStory}
    renderComponent={() => (
      <Form>
        <h2>Best User Analysis</h2>
        <Data input="measureUser" output="@measureUser" renderCell={WithLabel(SingleSelector, 'Measure')} />
        <Data output="@time" renderCell={WithLabel(TimeRange, 'Time Range')} />
        <Data input="bestUser" renderCell={WithLabel(Card, 'Best User Card')} />
        <h2>Best Customer Overview</h2>
        <Data input="measureCustomer" output="@measureCustomer" renderCell={WithLabel(SingleSelector, 'Measure')} />
        <Data input="bestCustomerQuery" renderCell={WithLabel(Card, 'Best Customer Query')} />
        <Data input="bestCustomerTSAD" renderCell={WithLabel(Card, 'Best Customer TSAD')} />
        <h2>Best Customer Expense Per User</h2>
        <Data input="granularityCustomer" output="@granularityCustomer" renderCell={WithLabel(SingleSelector, 'Granularity')} />
        <Data input="customerExpensePerUserBucket" renderCell={WithLabel(Card, 'Best Customer Expense Per User Bucket')} />
        <Data input="customerExpensePerUserRank" renderCell={WithLabel(Card, 'Best Customer Expense Per User TSAD')} />
        <h2>Favor XXX of Best Customers</h2>
        <Data input="measureFavor" output="@measureFavor" renderCell={WithLabel(SingleSelector, 'Measure')} />
        <Data input="dimensionFavor" output="@dimensionFavor" renderCell={WithLabel(SingleSelector, 'Dimension')} />
        <Data input="favorBestCustomerReduce" renderCell={WithLabel(Card, 'Favor Best Customer Reduce')} />
        <Data input="favorBestCustomerTrend" renderCell={WithLabel(Card, 'Favor Customer Trend')} />
        <h2>Usage of Meal Card</h2>
        <Data input="usageMealCardReduce" renderCell={WithLabel(Card, 'Usage of Meal Card Reduce')} />
        <Data input="usageMealCardBucketCRAP" renderCell={WithLabel(Card, 'Usage of Meal Card Bucket CardRechargeAmountPerUU')} />
        <Data input="usageMealCardQuery" renderCell={WithLabel(Card, 'Usage of Meal Card Query')} />
        <Data input="usageMealCardBucketCB" renderCell={WithLabel(Card, 'Usage of Meal Card CardBalance')} />
      </Form>
    )}
  />);
}
