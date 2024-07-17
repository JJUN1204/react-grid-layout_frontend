import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const RadarChartComponent  = ({ chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create(chartId, am4charts.RadarChart);
    chartRef.current = chart; // 차트 인스턴스를 ref에 저장

    // 차트 데이터 생성
    chart.data = [
      { category: '효율성', value: 80 },
      { category: '종속성', value: 35 },
      { category: '신뢰성', value: 92 },
      { category: '보안성', value: 68 },
      { category: '안정성', value: 58 },
    ];

    // X축 설정
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.grid.template.location = 0;

    // Y축 설정
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.axisFills.template.fill = am4core.color('#F3F3F3');
    valueAxis.renderer.axisFills.template.fillOpacity = 0.1;

    // 레이더 시리즈 설정
    const series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'category';
    series.name = 'Values';
    series.strokeWidth = 2;
    series.fillOpacity = 0.3;
    series.bullets.push(new am4charts.CircleBullet());

    // 애니메이션 효과 추가
    series.hiddenState.properties.opacity = 0;
    series.hiddenState.properties.endAngle = -90;
    series.hiddenState.properties.startAngle = -90;

    // 컴포넌트 언마운트 시 차트를 삭제합니다.
    return () => {
      chart.dispose();
    };
  }, [chartId]);

  return <div id={chartId} style={{ width: '100%', height: '100%' }} />;
};

export default RadarChartComponent ;
