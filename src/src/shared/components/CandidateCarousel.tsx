import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CandidateCard } from './CandidateCard';
import { PaginationDots } from './PaginationDots';
import { motion, AnimatePresence } from 'motion/react';

interface CandidateCarouselProps {
  sources: Array<{
    id: number;
    title: string;
    sourceLink: string;
    originalText: string;
    distortionScore: number;
    similarityScore: number;
    scores: {
      semanticReduction: number;
      interpretiveExtension: number;
      lexicalColoring: number;
    };
  }>;
  onViewSource: (source: any) => void;
}

/**
 * CandidateCarousel: 5개 후보 카드 슬라이드
 */
export function CandidateCarousel({ sources, onViewSource }: CandidateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentIndex < sources.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-4">
      {/* Carousel Header */}
      <div className="px-2">
        <h3 className="text-gray-700 mb-3">
          후보 원문 소스 ({sources.length})
        </h3>
        
        {/* Navigation: Arrows + Pagination Dots */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg transition-all ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Previous source"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <PaginationDots
            total={sources.length}
            activeIndex={currentIndex}
            onDotClick={handleDotClick}
          />

          <button
            onClick={handleNext}
            disabled={currentIndex === sources.length - 1}
            className={`p-2 rounded-lg transition-all ${
              currentIndex === sources.length - 1
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Next source"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <CandidateCard
              source={sources[currentIndex]}
              onViewSource={onViewSource}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}