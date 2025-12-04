import React from 'react';
import { ScoreIndicator } from './ScoreIndicator';

interface ScoreTripletProps {
  semanticReduction: number;      // SR: 의미 축소
  interpretiveExtension: number;  // IE: 해석 확장
  lexicalColoring: number;        // LC: 어휘 색채
}

/**
 * ScoreTriplet: 3축 점수 표시 (SR, IE, LC)
 */
export function ScoreTriplet({
  semanticReduction,
  interpretiveExtension,
  lexicalColoring,
}: ScoreTripletProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">의미 축소 (SR)</span>
        <ScoreIndicator score={semanticReduction} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">해석 확장 (IE)</span>
        <ScoreIndicator score={interpretiveExtension} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">어휘 색채 (LC)</span>
        <ScoreIndicator score={lexicalColoring} />
      </div>
    </div>
  );
}
