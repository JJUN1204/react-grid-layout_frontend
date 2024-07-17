import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/main.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Link } from 'react-router-dom';

import ChartSelectorPopup from './component/ChartSelectorPopup ';
import LineChartComponent from './component/LineChartComponent';
import BarChartComponent from './component/BarChartComponent ';
import PieChartComponent from './component/PieChartComponent ';
import RadarChartComponent from './component/RadarChartComponent ';
import ChartTypeDropdown from './component/ChartTypeDropDown';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MAIN_PAGE = () => {
  const [layouts, setLayouts] = useState([]);
  const [modifiedLayouts, setModifiedLayouts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/layouts');
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
        static: item.isStatic,
        chartType: item.chartType
      }));
      setLayouts(transformedLayouts);
      setModifiedLayouts(transformedLayouts);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    }
  };

  const saveLayouts = async () => {
    try {
      const response = await axios.put('http://localhost:8081/saveLayouts', modifiedLayouts);
      if (response.data.result === 'UPDATE_COMPLETE') {
        alert('수정 완료');
        setLayouts(modifiedLayouts); // 저장이 성공하면 레이아웃을 업데이트된 레이아웃으로 설정
      }
    } catch (e) {
      console.error('Error saving layouts:', e);
    }
  };

  const deleteLayouts = async (i) => {
    try {
      const response = await axios.delete(`http://localhost:8081/deleteLayout?i=${i}`);
      if (response.data.result === 'DELETE_COMPLETE') {
        setLayouts(prevLayouts => prevLayouts.filter(layout => layout.i !== i)); //id 값 찾아서 삭제
        alert('삭제 완료');
      }
    } catch (e) {
      console.error('Error deleting layouts:', e);
    }
  };

  const addGridItem = async (chartType) => {
    // 현재 레이아웃 중 가장 큰 y 값을 찾기
    const maxY = layouts.reduce((max, item) => Math.max(max, item.y), 0);
  
    const newItem = {
      i: `new-${layouts.length + 1}`,
      x: 0, // 왼쪽 위치
      y: maxY + 1, // 가장 큰 y 값 다음에 추가
      w: 5,
      h: 8,
      chartType // 추가된 chartType
    };
  
    try {
      const response = await axios.post('http://localhost:8081/generateLayouts', newItem);
      if (response.data.result === 'INSERT_COMPLETE') {
        setLayouts(prevLayouts => [...prevLayouts, newItem]);
        setModifiedLayouts(prevLayouts => [...prevLayouts, newItem]);
        alert('Layout 삽입');
      }
    } catch (e) {
      console.error('Error adding new grid item:', e);
    }
  };

  const handleLayoutChange = (layout) => {
    setModifiedLayouts(prevLayouts => {
      return layout.map(layout => ({ ...prevLayouts.find(item => item.i === layout.i), ...layout })); //아이디 값을 통해 예전 배열 새로운 배열로 덮어쓰기
    });
  };

  const handleBreakChange = () => {
    console.log('breakPoint', layouts);
  };

  const handleChartTypeChange = (chartId, newChartType) => {
    setLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.i === chartId ? { ...layout, chartType: newChartType } : layout
      )
    );
  };

  const renderChart = (chartType, chartId) => {
    switch (chartType) {
      case 'LineChart':
        return <LineChartComponent chartId={chartId} />;
      case 'BarChart':
        return <BarChartComponent chartId={chartId} />;
      case 'PieChart':
        return <PieChartComponent chartId={chartId} />;
      case 'RadarChart':
        return <RadarChartComponent chartId={chartId} />;
      default:
        return null;
    }
  };

  const handlePopupSelect = (chartType) => {
    setIsPopupOpen(false);
    addGridItem(chartType);
  };

  const handlePin = (i) => {
    setModifiedLayouts(prevLayouts => {
      const updatedLayouts = prevLayouts.map(layout =>
        layout.i === i ? { ...layout, static: true } : layout
      );
      return updatedLayouts;
    });
  };
  

  return (
    <div>
      <header id="header">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div className="button-container">
          <button onClick={saveLayouts}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 20H6C4.9 20 4 19.1 4 18V10C4 8.9 4.9 8 6 8H18C19.1 8 20 8.9 20 10V14H18V10H6V18H12V20M19.7 16.88L14.1 11.29L15.5 9.88L21.1 15.47L19.7 16.88Z" />
            </svg>
            수정
          </button>
          <button>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,3V4H4V6H5V20A1,1 0 0,0 6,21H18A1,1 0 0,0 19,20V6H20V4H15V3H9M7,6H17V20H7V6M9,8V18H11V8H9M13,8V18H15V8H13Z" />
            </svg>
            삭제
          </button>
          <button onClick={() => setIsPopupOpen(true)}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
            </svg>
            추가
          </button>
        </div>
      </header>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
        rowHeight={32}
        width={1200}
        isResizable={true}
        onLayoutChange={(layout, allLayouts) => handleLayoutChange(layout)}
        resizeHandles={['se']}
        breakpoints={{ lg: 1200, md: 1000, sm: 800, xs: 600, xxs: 400 }}
        onBreakpointChange={handleBreakChange}
        compactType={'vertical'}
        useCSSTransforms={true}
        draggableHandle=".draggable-handle"
      >
       {layouts.map(item => (
  <div key={item.i} data-grid={item} className="card">
    <div className="card-header">
      <button className="pin-button" onClick={() => handlePin(item.i)}>
        📌
      </button>
      <h2 className="draggable-handle">{item.chartType}</h2>
    </div>
    <ChartTypeDropdown
      chartType={item.chartType}
      onChange={(newChartType) => handleChartTypeChange(item.i, newChartType)}
    />
    <div className="chart">
      {renderChart(item.chartType, item.i)}
    </div>
    <button className="remove" onClick={() => deleteLayouts(item.i)}>x</button>
  </div>
))}



      </ResponsiveGridLayout>

      {isPopupOpen && (
        <ChartSelectorPopup
          onSelect={handlePopupSelect}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default MAIN_PAGE;
