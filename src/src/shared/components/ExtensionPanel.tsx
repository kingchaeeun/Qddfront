import { Quote, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { QuoteHeaderCard } from './QuoteHeaderCard';
import { CandidateCarousel } from './CandidateCarousel';
import { useState, useEffect, useRef } from 'react';
import { detectedQuotes, isQuoteDistorted } from '../data/quotesData';

interface ExtensionPanelProps {
  onViewSource: (source: any) => void;
  initialQuoteIndex?: number;
  onClose: () => void;
  highlightSettings: {
    distorted: boolean;
    normal: boolean;
  };
  onHighlightSettingsChange: (settings: { distorted: boolean; normal: boolean }) => void;
}

export function ExtensionPanel({ 
  onViewSource, 
  initialQuoteIndex = 0, 
  onClose,
  highlightSettings,
  onHighlightSettingsChange 
}: ExtensionPanelProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(initialQuoteIndex);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentQuoteIndex(initialQuoteIndex);
  }, [initialQuoteIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrevQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : detectedQuotes.length - 1));
  };

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex < detectedQuotes.length - 1 ? prevIndex + 1 : 0));
  };

  const currentQuote = detectedQuotes[currentQuoteIndex];
  const isDistorted = isQuoteDistorted(currentQuote);

  return (
    <div className="h-full flex flex-col">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#3D5AFE]" />
          <span>Quote Distortion Detection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={settingsRef}>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
                <h3 className="text-sm mb-3 text-gray-700">하이라이트 설정</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highlightSettings.distorted}
                      onChange={(e) => onHighlightSettingsChange({
                        ...highlightSettings,
                        distorted: e.target.checked
                      })}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm text-gray-700">왜곡된 인용문 표시</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highlightSettings.normal}
                      onChange={(e) => onHighlightSettingsChange({
                        ...highlightSettings,
                        normal: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">정상 인용문 표시</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative">
        {/* Navigation Arrows */}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-white/90 bg-white/70 rounded-full shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
          onClick={handlePrevQuote}
          disabled={currentQuoteIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-white/90 bg-white/70 rounded-full shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
          onClick={handleNextQuote}
          disabled={currentQuoteIndex === detectedQuotes.length - 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Current Detected Quote with Sources */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-gray-700 flex items-center gap-2">
              Detected Quote
              <sup className="text-[10px] text-black ml-0.5">{currentQuoteIndex + 1}</sup>
            </h2>
            <QuoteHeaderCard
              quoteId={currentQuote.id}
              quoteText={currentQuote.text}
              speaker={currentQuote.speaker}
              isDistorted={isDistorted}
            />
          </section>

          <section>
            <CandidateCarousel
              sources={currentQuote.sources}
              onViewSource={onViewSource}
            />
          </section>
        </div>
      </div>
    </div>
  );
}