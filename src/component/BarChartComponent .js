import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const BarChartComponent  = ({ chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create(chartId, am4charts.XYChart);
    chartRef.current = chart; // 차트 인스턴스를 ref에 저장
    chart.paddingRight = 20;

    // 차트 데이터 생성
    const data = [
      { category: '트래픽', value: 40 },
      { category: '통신량', value: 55 },
      { category: '장애수', value: 60 },
      { category: '통계', value: 70 },
      { category: '바이트', value: 80 },
    ];

    chart.data = data;

    // X축 설정
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    // Y축 설정
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // 시리즈 설정
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'category';
    series.tooltipText = '{categoryX}: [bold]{valueY}[/]';
    series.columns.template.strokeWidth = 0;

    // 마우스 호버 시 애니메이션 효과 추가
    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // 스크롤바 추가
    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'panX';
    chart.cursor.xAxis = categoryAxis;

    // 컴포넌트 언마운트 시 차트를 삭제합니다.
    return () => {
      chart.dispose();
    };
  }, [chartId]);

  return <div id={chartId} style={{ width: '100%', height: '100%' }} />;
};

export default BarChartComponent ;
