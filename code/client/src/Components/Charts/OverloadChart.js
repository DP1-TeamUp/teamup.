import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    subject: 'Ibtid',
    A: 50,
  },
  {
    subject: 'Nafiz',
    A: 100,
  },
  {
    subject: 'Adiba',
    A: 86,
  },
  {
    subject: 'Robi',
    A: 99,
  },
  {
    subject: 'Sananda',
    A: 85,
  },
  {
    subject: 'Hissan',
    A: 65,
  },
  {
    subject: 'Fahim',
    A: 75,
  },
];

const OverLoadChart = () => {
  return (
    <ResponsiveContainer width='85%' height='70%'>
      <RadarChart cx='60%' cy='60%' outerRadius='80%' data={data}>
        <PolarGrid stroke='#525252' fill='#525252' />
        <PolarAngleAxis dataKey='subject' stroke='#f2f2f2' />

        <Radar name='Mike' dataKey='A' fill='#00AAF2' fillOpacity={0.7} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default OverLoadChart;