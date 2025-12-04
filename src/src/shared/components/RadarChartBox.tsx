import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartBoxProps {
  semanticReduction: number;
  interpretiveExtension: number;
  lexicalColoring: number;
}

/**
 * RadarChartBox: 육각형 레이더 차트
 */
export function RadarChartBox({
  semanticReduction,
  interpretiveExtension,
  lexicalColoring,
}: RadarChartBoxProps) {
  const data = [
    { subject: '의미 축소', value: semanticReduction, fullMark: 100 },
    { subject: '해석 확장', value: interpretiveExtension, fullMark: 100 },
    { subject: '어휘 색채', value: lexicalColoring, fullMark: 100 },
  ];

  // 최대 점수에 따라 색상 결정
  const maxScore = Math.max(semanticReduction, interpretiveExtension, lexicalColoring);
  const getColor = () => {
    if (maxScore >= 85) return '#dc2626'; // red-600
    if (maxScore >= 70) return '#ea580c'; // orange-600
    return '#2563eb'; // blue-600
  };

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="왜곡 점수"
            dataKey="value"
            stroke={getColor()}
            fill={getColor()}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
