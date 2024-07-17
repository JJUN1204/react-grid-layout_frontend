import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const PieChartComponent  = ({ chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create(chartId, am4charts.PieChart);
    chartRef.current = chart; // 차트 인스턴스를 ref에 저장

    // 차트 데이터 생성
    chart.data = [
      { category: '통신 장애', value: 40 },
      { category: '서버 장애', value: 55 },
      { category: '혼잡 장애', value: 60 },
      { category: '장비 장애', value: 70 },
      { category: '오류 장애', value: 80 },
    ];

    // 파이 시리즈 설정
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'category';
    pieSeries.slices.template.tooltipText = '{category}: [bold]{value}[/]';

    // 애니메이션 효과 추가
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    // 컴포넌트 언마운트 시 차트를 삭제합니다.
    return () => {
      chart.dispose();
    };
  }, [chartId]);

  return <div id={chartId} style={{ width: '100%', height: '100%' }} />;
};

export default PieChartComponent ;
