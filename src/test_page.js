import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Link } from 'react-router-dom';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Test_PAGE = () => {
  const [layouts, setLayouts] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchLayouts();

    let chart = am4core.create(chartRef.current, am4charts.XYChart);
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

    return () => {
      chart.dispose();
    };
  }, []);

  const fetchLayouts = async () => {
    try {
      const response = await axios.get('http://43.202.129.245:8081/layouts');
      console.log('Fetched layouts:', response.data);

      const transformedLayouts = response.data.map(item => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        maxW: item.maxW,
        minH: item.minH,
        maxH: item.maxH,
        static: item.isStatic
      }));

      setLayouts(transformedLayouts);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    }
  };

  const saveLayouts = async () => {
    try {
      const response = await axios.put('http://43.202.129.245:8081/saveLayouts', layouts);
      if (response.data.result === 'UPDATE_COMPLETE') {
        alert('수정 완료');
      }
    } catch (e) {
      console.error('Error saving layouts:', e);
    }
  };

  const deleteLayouts = async (i) => {
    console.log(i);
    try {
      const response = await axios.delete(`http://43.202.129.245:8081/deleteLayout?i=${i}`);
      if (response.data.result === 'DELETE_COMPLETE') {
        setLayouts(prevLayouts => prevLayouts.filter(layout => layout.i !== i));
        alert('삭제 완료');
      }
    } catch (e) {
      console.error('Error deleting layouts:', e);
    }
  };

  const addGridItem = async () => {
    const lastItem = layouts.reduce((prev, current) => (prev.y > current.y || (prev.y === current.y && prev.x > current.x) ? prev : current), { x: 0, y: 0, w: 0 });

    const newItem = {
      i: `new-${layouts.length + 1}`,
      x: (lastItem.x + lastItem.w) % 12,
      y: lastItem.y + (lastItem.x + lastItem.w >= 12 ? 1 : 0),
      w: 3,
      h: 3
    };

    try {
      const response = await axios.post('http://43.202.129.245:8081/generateLayouts', newItem);
      if (response.data.result === 'INSERT_COMPLETE') {
        setLayouts(prevLayouts => [...prevLayouts, newItem]);
        alert('Layout 삽입');
      }
    } catch (e) {
      console.error('Error adding new grid item:', e);
    }
  };

  const handleLayoutChange = (layout) => {
    setLayouts(layout);
    console.log('Updated layouts:', layout);
  };

  const handleBreakChange = () => {
    console.log('breakPoint', layouts);
  };

  return (
    <div>
      <header>
        <div className="navbar">
          <Link to='/'>REACT_GRID_LAYOUT</Link>
          <nav>
            <Link to='/'>TEST_PAGE</Link>
            <Link to='/main_page'>MAIN_PAGE</Link>
            <Link to='/'>Contact</Link>
          </nav>
        </div>
      </header>
      <div className="container">
        <div className="buttons">
          <button onClick={saveLayouts}>Save Layouts</button>
          <button onClick={addGridItem}>Add Grid Item</button>
        </div>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
          cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
          rowHeight={30}
          width={1200} // Adjust width as needed
          isResizable={true}
          onLayoutChange={(layout, allLayouts) => handleLayoutChange(layout)}
          resizeHandles={['se']}
          breakpoints={{ lg: 1200, md: 1000, sm: 800, xs: 600, xxs: 400 }}
          onBreakpointChange={handleBreakChange}
          compactType={'vertical'}
        >
          {layouts.map(item => (
            item.i === 'chart' ?
              <div key={item.i} className="grid-item">
                <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
                <button
                  className="remove"
                  onClick={() => deleteLayouts(item.i)}
                >
                  x
                </button>
              </div>
              :
              <div key={item.i} className="grid-item">
                <h2>{item.i}</h2>
                <button
                  className="remove"
                  onClick={() => deleteLayouts(item.i)}
                >
                  x
                </button>
              </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Test_PAGE;
