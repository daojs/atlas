import React, { PureComponent } from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import StoryBoardTest from '../story-board/index-test';
import components from '../components';

const {
  Bar,
  CellTest,
  SingleSelector,
  PlainData,
  SectionContainer,
  Donut,
  LineWithDataZoom,
  SectionCard,
  HorizontalBar,
  TimeRangePickerTest,
} = components;

export default class LayoutTest extends PureComponent { //eslint-disable-line
  render() {
    return (
      <StoryBoardTest
        renderComponent={() => (
          <Form>
            <h2>Best User Analysis</h2>
            <SectionContainer id="1">
              <div key="slicer">
                <CellTest id="time" input="time" output="@time" label="Time Range" Control={TimeRangePickerTest} />
              </div>
              <SectionCard key="bestUser" title="Best User Analysis of xxx">
                <CellTest id="measureUser" input="measureUser" output="@measureUser" label="Measure" Control={SingleSelector} />
                <CellTest id="bestUser" input="bestUser" title="Best User SectionCard" Control={PlainData} />
              </SectionCard>
              <SectionCard key="bestCustomer" title="Best Customer Overview">
                <CellTest id="measureCustomer" input="measureCustomer" output="@measureCustomer" label="Measure" Control={SingleSelector} />
                <CellTest id="bestCustomerQuery" input="bestCustomerQuery" title="Best Customer Query" Control={PlainData} />
                <CellTest id="bestCustomerTSAD" input="bestCustomerTSAD" title="Best Customer TSAD" Control={LineWithDataZoom} />
              </SectionCard>
            </SectionContainer>
          </Form>
        )}
      />);
  }
}
