// ChartTypeDropdown.js
import React from 'react';

const ChartTypeDropdown = ({ chartId, currentChartType, onChangeChartType }) => {
  const handleTypeChange = (e) => {
    onChangeChartType(chartId, e.target.value);
  };

  return (
    <div className="chart-type-dropdown">
      <label>{chartId}</label>
      <select value={currentChartType} onChange={handleTypeChange}>
        <option value="LineChart">Line</option>
        <option value="BarChart">Bar</option>
        <option value="PieChart">Pie</option>
        <option value="RadarChart">Radar</option>
      </select>
    </div>
  );
};

export default ChartTypeDropdown;
