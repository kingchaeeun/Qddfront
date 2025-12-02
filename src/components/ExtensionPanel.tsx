import { Quote, Settings, ChevronLeft, ChevronRight, X, ChevronRight as ChevronRightSmall } from 'lucide-react';
import { QuoteCard } from './QuoteCard';
import { SourceCarousel } from './SourceCarousel';
import { useState, useEffect, useRef } from 'react';
import { detectedQuotes } from '../data/quotesData';

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

  return (
    <div className="h-full flex flex-col">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#3D5AFE]" />
          <span>Quote Distortion Detection</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
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
        <div>
          <section>
            <h2 className="mb-4 text-gray-700 flex items-center gap-2">
              Detected Quote
              <sup className="text-[10px] text-black ml-0.5">{currentQuoteIndex + 1}</sup>
            </h2>
            <QuoteCard quote={detectedQuotes[currentQuoteIndex]} />
            
            <div className="mt-4">
              <h3 className="mb-3 text-gray-700">
                Recommended Sources ({detectedQuotes[currentQuoteIndex].sources.length})
              </h3>
              <SourceCarousel sources={detectedQuotes[currentQuoteIndex].sources} onViewSource={onViewSource} />
            </div>
          </section>
        </div>
      </div>

      {/* Page Indicator */}
      <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {detectedQuotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuoteIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuoteIndex ? 'bg-[#3D5AFE]' : 'bg-gray-300'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Settings Dropdown */}
      {isSettingsOpen && (
        <div ref={settingsRef} className="absolute top-14 right-6 bg-white border border-gray-200 shadow-md rounded-lg z-20">
          <div className="p-4">
            <h3 className="text-sm font-bold mb-2">Highlight Settings</h3>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={highlightSettings.distorted}
                onChange={(e) => onHighlightSettingsChange({ ...highlightSettings, distorted: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm">Distorted</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={highlightSettings.normal}
                onChange={(e) => onHighlightSettingsChange({ ...highlightSettings, normal: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm">Normal</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}