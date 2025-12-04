// Sidepanel App: 확장 프로그램 사이드 패널 UI
import { useState, useEffect } from 'react';
import { ExtensionPanel } from '../shared/components/ExtensionPanel';
import { SourceModal } from '../shared/components/SourceModal';
import '../shared/styles/globals.css';

export default function SidepanelApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [highlightSettings, setHighlightSettings] = useState({
    distorted: true,
    normal: false,
  });

  // content script로부터 인용문 클릭 이벤트 수신
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'QUOTE_CLICKED_TO_PANEL') {
        setSelectedQuoteIndex(message.quoteIndex);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // 하이라이트 설정 변경 시 content script에 알림
  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'HIGHLIGHT_SETTINGS_CHANGED',
      settings: highlightSettings,
    });
  }, [highlightSettings]);

  const handleViewSource = (source: any) => {
    setSelectedSource(source);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    // 패널 닫기 (실제로는 사용자가 브라우저 UI로 닫음)
    // 필요시 background script에 메시지를 보낼 수 있음
  };

  return (
    <div className="h-screen w-[420px] bg-white overflow-hidden">
      <ExtensionPanel
        onViewSource={handleViewSource}
        initialQuoteIndex={selectedQuoteIndex}
        onClose={handleClose}
        highlightSettings={highlightSettings}
        onHighlightSettingsChange={setHighlightSettings}
      />

      {isModalOpen && (
        <SourceModal
          source={selectedSource}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
