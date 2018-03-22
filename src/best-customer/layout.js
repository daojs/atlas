import React from 'react';
import { Form, Card } from 'antd';
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
        <SectionContainer id={storyConfig.id}>
          <div key="slicer">
            <Cell output="@time" renderCell={WithLabel(TimeRange, 'Time Range')} />
          </div>
          <Card key="bestUser">
            <Cell input="measureUser" output="@measureUser" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestUser" renderCell={WithLabel(PlainData, 'Best User Card')} />
          </Card>
          <Card key="bestCustomer" title="Best Customer Overview">
            <Cell input="measureCustomer" output="@measureCustomer" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="bestCustomerQuery" renderCell={WithLabel(PlainData, 'Best Customer Query')} />
            <Cell input="bestCustomerTSAD" renderCell={WithLabel(PlainData, 'Best Customer TSAD')} />
          </Card>
          <Card key="bestCustomerExpensePerUser" title="Best Customer Expense Per User">
            <Cell input="granularityCustomer" output="@granularityCustomer" renderCell={WithLabel(SingleSelector, 'Granularity')} />
            <Cell input="customerExpensePerUserBucket" renderCell={WithLabel(PlainData, 'Best Customer Expense Per User Bucket')} />
            <Cell input="customerExpensePerUserRank" renderCell={WithLabel(PlainData, 'Best Customer Expense Per User TSAD')} />
          </Card>
          <Card key="favor" title="Favor XXX of Best Customers">
            <Cell input="measureFavor" output="@measureFavor" renderCell={WithLabel(SingleSelector, 'Measure')} />
            <Cell input="dimensionFavor" output="@dimensionFavor" renderCell={WithLabel(SingleSelector, 'Dimension')} />
            <Cell input="favorBestCustomerReduce" renderCell={WithLabel(PlainData, 'Favor Best Customer Reduce')} />
            <Cell input="favorBestCustomerTrend" renderCell={WithLabel(PlainData, 'Favor Customer Trend')} />
          </Card>
          <Card key="mealCard" title="Usage of Meal Card">
            <Cell input="usageMealCardReduce" renderCell={WithLabel(PlainData, 'Usage of Meal Card Reduce')} />
            <Cell input="usageMealCardBucketCRAP" renderCell={WithLabel(PlainData, 'Usage of Meal Card Bucket CardRechargeAmountPerUU')} />
            <Cell input="usageMealCardQuery" renderCell={WithLabel(PlainData, 'Usage of Meal Card Query')} />
            <Cell input="usageMealCardBucketCB" renderCell={WithLabel(PlainData, 'Usage of Meal Card CardBalance')} />
          </Card>
        </SectionContainer>
      </Form>
    )}
  />);
}
