import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  scores: {
    semanticReduction: number;
    interpretiveExtension: number;
    lexicalColoring: number;
  };
  isHighDistortion?: boolean;
}

export function RadarChart({ scores, isHighDistortion = false }: RadarChartProps) {
  const data = [
    {
      subject: 'Semantic',
      value: scores.semanticReduction,
      fullMark: 100,
    },
    {
      subject: 'Interpretive',
      value: scores.interpretiveExtension,
      fullMark: 100,
    },
    {
      subject: 'Lexical',
      value: scores.lexicalColoring,
      fullMark: 100,
    },
  ];

  const chartColor = isHighDistortion ? "#DC2626" : "#3D5AFE"; // red-600 : blue

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#E0E0E0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#616161', fontSize: 10 }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
        <Radar
          name="Distortion"
          dataKey="value"
          stroke={chartColor}
          fill={chartColor}
          fillOpacity={0.5}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}