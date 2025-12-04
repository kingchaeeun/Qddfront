import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SourceCard } from './SourceCard';

interface SourceCarouselProps {
  sources: any[];
  onViewSource: (source: any) => void;
}

export function SourceCarousel({
  sources,
  onViewSource
}: SourceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : sources.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < sources.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div>
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-700">
          후보 원문 소스 ({sources.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous source"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === sources.length - 1}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next source"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Current Source Card */}
      <SourceCard source={sources[currentIndex]} onViewSource={onViewSource} />

      {/* Dot Indicators - Bottom */}
      <div className="flex justify-center gap-2 mt-3">
        {sources.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-[#3D5AFE] w-6'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to source ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}