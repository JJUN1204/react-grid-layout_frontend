import React from 'react';
import '../css/chartPopup.css';
import BarChart from '../images/BarChart.jpg';
import LineChart from '../images/LineChart.jpg';
import PieChart from '../images/PieChart.jpg';
import RadarChart from '../images/RadarChart.jpg';

const ChartSelectorPopup = ({ onSelect, onClose }) => {
  const charts = [
    { name: 'LineChart', image: LineChart },
    { name: 'BarChart', image: BarChart },
    { name: 'PieChart', image: PieChart },
    { name: 'RadarChart', image: RadarChart },
  ];

  return (
    <div className="popup">
      <div className="popup-inner">
      
        <h2>차트 선택</h2>
        <div className="chart-options">
          {charts.map(chart => (
            <div key={chart.name} className="chart-option" onClick={() => onSelect(chart.name)}>
              <img src={chart.image} alt={chart.name} />
              <p>{chart.name}</p>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChartSelectorPopup;
