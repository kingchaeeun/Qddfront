import { useState } from 'react';
import { NewsArticle } from './components/NewsArticle';
import { ExtensionPanel } from './components/ExtensionPanel';
import { SourceModal } from './components/SourceModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [highlightSettings, setHighlightSettings] = useState({
    distorted: true,  // 왜곡 인용문 (1-6번)
    normal: false,    // 정상 인용문 (7-19번)
  });

  const handleViewSource = (source: any) => {
    setSelectedSource(source);
    setIsModalOpen(true);
  };

  const handleQuoteClick = (quoteIndex: number) => {
    // 같은 인용문을 다시 클릭하면 패널 닫기
    if (isPanelOpen && selectedQuoteIndex === quoteIndex) {
      setIsPanelOpen(false);
    } else {
      setSelectedQuoteIndex(quoteIndex);
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left: News Article */}
      <div className="flex-1 overflow-auto transition-all duration-300">
        <NewsArticle onQuoteClick={handleQuoteClick} highlightSettings={highlightSettings} isPanelOpen={isPanelOpen} />
      </div>

      {/* Right: Extension Panel */}
      <div 
        className={`h-full bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
          isPanelOpen ? 'w-[420px]' : 'w-0'
        }`}
      >
        <div className="w-[420px] h-full">
          <ExtensionPanel 
            onViewSource={handleViewSource} 
            initialQuoteIndex={selectedQuoteIndex}
            onClose={() => setIsPanelOpen(false)}
            highlightSettings={highlightSettings}
            onHighlightSettingsChange={setHighlightSettings}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SourceModal
          source={selectedSource}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}