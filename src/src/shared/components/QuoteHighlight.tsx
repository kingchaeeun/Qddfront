import React from 'react';

interface QuoteHighlightProps {
  quoteId: number;
  isVisible: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * QuoteHighlight: 기사 내 인용문 하이라이트
 * Content Script에서 사용됨
 */
export function QuoteHighlight({ quoteId, isVisible, onClick, children }: QuoteHighlightProps) {
  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <span
      className="quote-highlight-visible cursor-pointer hover:bg-yellow-300 transition-colors"
      onClick={onClick}
      data-quote-id={quoteId}
    >
      {children}
      <sup className="quote-number">{quoteId}</sup>
    </span>
  );
}
