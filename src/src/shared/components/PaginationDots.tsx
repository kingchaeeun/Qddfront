import React from 'react';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  onDotClick?: (index: number) => void;
}

/**
 * PaginationDots: 현재 후보 위치 표시
 */
export function PaginationDots({ total, activeIndex, onDotClick }: PaginationDotsProps) {
  return (
    <div className="flex justify-center gap-2 py-3">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === activeIndex
              ? 'bg-blue-600 w-6'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to source ${index + 1}`}
        />
      ))}
    </div>
  );
}
