import React from 'react';
import { Form, Row, Col } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import StoryBoard from '../../story-board';
import storyConfig from './story';
import components from '../../components';

const {
  Cell,
  Heatmap,
  // TimeRange,
  // SingleSelector,
  // PlainData,
  SectionContainer,
  Markdown,
  // Donut,
  // LineWithDataZoom,
  LineWithMarkArea,
  SectionCard,
  LineBarChart,
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
        <h2 className="master-kong-header">2018年销售预测分析报告</h2>
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
                <Cell input="masterKongRevenueForecast" title="销售额趋势预测" renderCell={WithComponent(LineWithMarkArea)} />
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <Cell input="annualRevenueGoalRisk" title="年度目标完成风险分析" subTitle="差距" renderCell={WithComponent(LineBarChart)} />
              </Col>
              <Col span={8}>
                <Cell input="revenueExplanation" renderCell={WithComponent(Markdown)} />
              </Col>
            </Row>
          </SectionCard>
          <SectionCard
            key="volume-forecast"
            title="2018年销量预测"
          >
            <Row>
              <Col>
                <Cell input="masterKongVolumeForecast" title="销量趋势预测" renderCell={WithComponent(LineWithMarkArea)} />
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <Cell input="annualVolumeGoalRisk" title="年度目标完成风险分析" subTitle="差距" renderCell={WithComponent(LineBarChart)} />
              </Col>
              <Col span={8}>
                <Cell input="volumeExplanation" renderCell={WithComponent(Markdown)} />
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
                <Cell input="salesLastYear" title="历史促销互动分析(2017年度)" renderCell={WithComponent(LineWithMarkArea)} />
              </Col>
              <Col span={8}>
                <Cell input="promotionRecommendation" renderCell={WithComponent(Markdown)} />
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                {/* TODO: @Zhibin */}
                <Cell input="revenueGapPerCategory" title="各类商品销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
              </Col>
              <Col span={8}>
                <Cell input="revenueGapPerBranch" title="各地区销售指标完成度预测" subTitle="差距" renderCell={WithComponent(Heatmap)} />
              </Col>
            </Row>
          </SectionCard>
        </SectionContainer>
      </Form>
    )}
  />);
}
