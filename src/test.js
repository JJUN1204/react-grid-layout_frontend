import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from "react-grid-layout";

/*
  layout
  i(string) : 그리드의 고유 키값 
  x(number) : 열의 x 위치 (w 값에 따라 잘 조정 필요)
  y(number) : 열의 y 위치 
  w(number) : 가로의 너비 
  h(number) : 높이
  minW(number) : 그리드 가로의 최소 넓이 
  maxW(number) : 그리드 가로의 최대 넓이
  minH(number) : 그리드의 최소 높이 
  maxH(number) : 그리드의 최대 높이
  static(boolean) : 그리드의 크기를 늘릴 수 없고 입력한 값을 고정
*/

/*
  Gridlayout
  className(string) : css 클래스 이름 적어주기 
  layout(array): 만든 그리드의 배열을 대입하는 곳 
  cols(number): 1x1이 들어갈 수 있는 열의 길이
  rowHeight(number): 그리드가 들어갈 수 있는 열의 높이
  width(number): 그리드가 들어갈 수 있는 행의 너비
  isDraggable(boolean) : 드래그 가능 여부	
  isResizable(boolean) : 크기 조절 가능 여부	
  resizeHandles(array): ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] 사이즈 조절 핸들 위치 배열
*/

/*
  ResponsiveGridLayout(반응형 그리드)                                                                             
  breakpoints({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }) : width 크기에 따라 변함             
  columns({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }) : breakpoints에 도달할 때 유동적으로 변하는 컬럼의 수
  compactType("vertical 위", "horizontal 왼", "null") : 드래그할 때 빈 공간으로 아이템들이 가능한 위치로 이동
  onLayoutChange(Function) : 레이아웃이 변경되었을 때 함수 호출
  onBreakpointChange(Function) : 브레이크 포인트에 도달했을 때 함수 호출 
  useCSSTransforms(Boolean) : CSS 변경에 대한 동의
*/

const ResponsiveGridLayout = WidthProvider(Responsive);

const Test = () => {
  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    fetchLayouts();
  }, []);

  useEffect(() => {
    console.log('Updated layouts:', layouts);
  }, [layouts]);

  const fetchLayouts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/layouts');
      console.log('Fetched layouts:', response.data);

      const transformedLayouts = response.data.map(item => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }));

      setLayouts(transformedLayouts);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    }
  };

  const saveLayouts = async () => { 
    try {  
      const response = await axios.put('http://localhost:8081/saveLayouts', layouts); 
      if (response.data.result === "UPDATE_COMPLETE") {  
        alert("수정 완료"); 
      } 
    } catch (e) {  
      console.error('Error saving layouts:', e); 
    } 
  };

  const addGridItem = () => {
    const newItem = {
      i: `new-${layouts.length + 1}`,
      x: layouts.length * 2 % 12,
      y: Infinity, // 새로운 아이템을 마지막 행에 추가하려면 y 값을 Infinity로 설정
      w: 2,
      h: 2
    };
    setLayouts(prevLayouts => [...prevLayouts, newItem]);
  };

  const handleLayoutChange = newLayout => {
    setLayouts(newLayout);
  };

  return (
    <div>
      <button onClick={saveLayouts}>Save Layouts</button>
      <button onClick={addGridItem}>Add Grid Item</button>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
        rowHeight={30}
        width={1200} // Adjust width as needed
        isResizable={true}
        onLayoutChange={handleLayoutChange}
        resizeHandles={['se']}
        breakpoints={{ lg: 1200, md: 1000, sm: 800, xs: 600, xxs: 400 }}
      >
        {layouts.map((item, index) => (
          <div key={item.i} className="grid-item">
            <h2>{item.i}</h2>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Test;
