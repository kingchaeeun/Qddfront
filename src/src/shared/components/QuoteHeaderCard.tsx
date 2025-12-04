import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteHeaderCardProps {
  quoteId: number;
  quoteText: string;
  speaker: string;
  isDistorted: boolean;
}

/**
 * QuoteHeaderCard: 인용문 Title + ID
 */
export function QuoteHeaderCard({ quoteId, quoteText, speaker, isDistorted }: QuoteHeaderCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDistorted ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Quote className={`w-6 h-6 ${
              isDistorted ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Quote #{quoteId}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isDistorted 
                ? 'bg-red-100 text-red-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isDistorted ? 'Distorted' : 'Normal'}
            </span>
          </div>
          
          <p className="text-gray-900 mb-2">
            "{quoteText}"
          </p>
          
          <p className="text-sm text-gray-600">
            — {speaker}
          </p>
        </div>
      </div>
    </div>
  );
}
