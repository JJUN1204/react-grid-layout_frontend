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

/*
  layout
  i(string) :그리드의 고유 키값 
  x(number) :열의 x위치 w값에 따라 잘 조정해야할 듯 
  y(number) :열의 y위치 
  w(number) :가로의 너비 
  h(number) :높이
  minW(number) : 그리드 가로의 최소 넓이 
  maxW(number) :그리드 가로의 최대 넓이
  minH(number) :그리드의 최소 높이 
  maxH(number) :그리드의 최대 높이
  static(boolean) : 그리드의 크기를 늘릴 수 없고 입력한 값을 고정

*/

/*
  Gridlayout
  className(string) : css 클래스 이름 적어주기 
  layout(string): 만든 그리드의 변수명 대입하는 곳 
  cols(number): 1x1이 들아길 수 있는 열의 길이
  rowHeight(number): 그리드가 들어갈 수 있는 열의 높이
  width(number): 그리드가 들어갈 수 있는 행의 넓이
  isDraggable(boolean) :드래그 가능 여부	
  isResizable(boolean)	:크기 조절 가능 여부	
  resizeHandles(array) ['s', 'w' , 'e' , 'n' , 'sw' , 'nw' , 'se' , 'ne']	사이즈 조절 핸들 위치 배열
*/

/*
  ResponsiveGridLayout(반응형 그리드)                                                                             
  breakpoints({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }) : width 크기에 따라 변함             
  colums({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }) : breakpoints에 도달할때 유동적으로 변하는 컬럼의 수
  compactType("vertical 위","horizontal 왼","null") : 드래그할 때 빈공간으로 아이템들이 가능한 위치로 이동
  onLayoutChange(Function) : 레이아웃이 변경되었을때 함수호출
  onBreakpointChange(Function) : 브레이크 포인트에 도달했을때 함수호출 
  useCSSTransforms(Boolean) : css 변경에대한 동의
*/

const ResponsiveGridLayout = WidthProvider(Responsive);

const MAIN_PAGE = () => {
  const [layouts, setLayouts] = useState([]);
  const [modifiedLayouts, setModifiedLayouts] = useState([]);
  const [selectedChart, setSelectedChart] = useState('ChartComponent1');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const response = await axios.get('http://43.202.129.245:8081/layouts');
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
      const response = await axios.put('http://43.202.129.245:8081/saveLayouts', modifiedLayouts);
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
      const response = await axios.delete(`http://43.202.129.245:8081/deleteLayout?i=${i}`);
      if (response.data.result === 'DELETE_COMPLETE') {
        setLayouts(prevLayouts => prevLayouts.filter(layout => layout.i !== i)); //id 값 찾아서 삭제
        //setModifiedLayouts(prevLayouts => prevLayouts.filter(layout => layout.i !== i)); 
        alert('삭제 완료');
      }
    } catch (e) {
      console.error('Error deleting layouts:', e);
    }
  };

  const addGridItem = async (chartType) => {
    const newItem = {
      i: `new-${layouts.length + 1}`,
      x: 0, // 왼쪽 아래 위치
      y: Infinity, // y 값을 Infinity로 설정하여 맨 아래에 추가
      w: 5,
      h: 8,
      chartType // 추가된 chartType
    };
  
    try {
      const response = await axios.post('http://43.202.129.245:8081/generateLayouts', newItem);
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
        draggableHandle=".draggable-handle"  // 이 줄을 추가합니다
      >
        {layouts.map(item => (
          <div key={item.i} data-grid={item} className="card">
            <h2 className="draggable-handle">{item.chartType}</h2>
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
