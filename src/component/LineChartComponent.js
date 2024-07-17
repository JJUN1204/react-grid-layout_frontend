import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const LineChartComponent = ({ chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create(chartId, am4charts.XYChart);
    chartRef.current = chart; // 차트 인스턴스를 ref에 저장
    chart.paddingRight = 20;

    const data = [];
    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), value: visits });
    }

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '{valueY.value}';
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    series.tooltip.pointerOrientation = 'vertical';

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color('#fff');

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'panXY';
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // 컴포넌트 언마운트 시 차트를 삭제합니다.
    return () => {
      chart.dispose();
    };
  }, [chartId]);

  return <div id={chartId} style={{ width: '100%', height: '100%' }} />;
};

export default LineChartComponent;
