import React from 'react';

interface ScoreIndicatorProps {
  score: number;
  label?: string;
  showValue?: boolean;
}

/**
 * ScoreIndicator: Normal/Distorted 색상 구분
 * - score >= 85: 빨강 (High)
 * - 70 <= score < 85: 주황 (Medium)
 * - score < 70: 파랑 (Low/Normal)
 */
export function ScoreIndicator({ score, label, showValue = true }: ScoreIndicatorProps) {
  const getScoreColor = () => {
    if (score >= 85) return 'text-distortion-high';
    if (score >= 70) return 'text-distortion-medium';
    return 'text-normal';
  };

  const getScoreLabel = () => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Distorted';
    return 'Normal';
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <span className={`font-semibold ${getScoreColor()}`}>
        {showValue && `${score}`}
        {!showValue && getScoreLabel()}
      </span>
    </div>
  );
}