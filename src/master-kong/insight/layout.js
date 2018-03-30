import React from 'react';
import { Form, Row, Col } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';
import Usage from './usage-metric-trend-chart';

const {
  Bar,
  // Compare,
  Cell,
  Heatmap,
  TimeRange,
  SingleSelector,
  // PlainData,
  SectionContainer,
  // Donut,
  // LineWithDataZoom,
  Line,
  SectionCard,
  // StackBar,
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
        <h2 className="master-kong-header">2018年销售额预测</h2>
        <SectionContainer id="20002" >
          {/* <SectionCard
            key="revenue-predicate"
            title="总体销售额预测"
            // extra={<span>h1</span>}
          >
            <Cell renderCell={WithComponent(Usage)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-branch"
            title="指定行销部门"
            extra={<Cell input="branch" output="@branch" renderCell={WithComponent(DropdownSelector)} />}
          >
            <Cell input="revenueBreakDownByBranch" title="预测销售额与目标销售额对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="volumeBreakDownByBranch" title="预测销量与目标销量对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="revenueGapPerCategory" title="各类商品销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="given-category"
            title="指定产品"
            extra={<Cell input="category" output="@category" renderCell={WithComponent(DropdownSelector)} />}
          >
            <Cell input="revenueBreakDownByCategory" title="预测销售额与目标销售额对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="volumeBreakDownByCategory" title="预测销量与目标销量对比" subTitle="差距" renderCell={WithComponent(Bar)} />
            <Cell input="revenueGapPerBranch" title="各地区销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
          </SectionCard> */}

          <SectionCard
            key="revenue-forecast"
            title="2018年销售额预测"
          >
            <Row>
              <Col>
                {/* TODO: @Teng  */}
                <Cell renderCell={WithComponent(Usage)} />
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                {/* TODO: @Ling  */}
                <Cell input="revenueBreakDownByCategory" title="预测销售额与目标销售额对比" subTitle="差距" renderCell={WithComponent(Bar)} />
              </Col>
              <Col span={8}>
                {/* TODO: @Wei */}
              </Col>
            </Row>
          </SectionCard>
          <SectionCard
            key="volume-forecast"
            title="2018年销量预测"
          >
            <Row>
              <Col>
                {/* TODO: @Teng  */}
                <Cell renderCell={WithComponent(Usage)} />
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                {/* TODO: @Ling  */}
                <Cell input="volumeBreakDownByCategory" title="预测销量与目标销量对比" subTitle="差距" renderCell={WithComponent(Bar)} />
              </Col>
              <Col span={8}>
                {/* TODO: @Wei */}
              </Col>
            </Row>
          </SectionCard>
          <SectionCard
            key="advise-analysis"
            title="2018年销售建议"
          >
            <Row>
              <Col span={16}>
                {/* TODO: @Yu */}
                <Cell renderCell={WithComponent(Usage)} />
              </Col>
              <Col span={8}>
                {/* TODO: @Wei */}
              </Col>
            </Row>
            <Row>
              <Col>
                {/* TODO: @Zhibin */}
                <Cell input="revenueGapPerBranch" title="各地区销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
              </Col>
            </Row>
          </SectionCard>
          <SectionCard
            className="overall-analysis"
            key="sales-advice"
            title="2018年销售建议"
          >
            <Cell input="salesLastYear" title="去年的销售趋势" renderCell={WithComponent(Line)} />
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
