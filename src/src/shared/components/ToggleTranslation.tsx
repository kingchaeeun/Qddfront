import React from 'react';
import { Languages } from 'lucide-react';

interface ToggleTranslationProps {
  isTranslated: boolean;
  onToggle: () => void;
}

/**
 * ToggleTranslation: 한국어/영어 전환 버튼
 */
export function ToggleTranslation({ isTranslated, onToggle }: ToggleTranslationProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    >
      <Languages className="w-4 h-4" />
      <span>{isTranslated ? '원문 보기' : '번역 보기'}</span>
    </button>
  );
}
