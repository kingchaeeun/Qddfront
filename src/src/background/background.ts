// Background Service Worker
// 사이드 패널과 content script 간의 메시지 라우팅 담당

chrome.runtime.onInstalled.addListener(() => {
  console.log('Quote Distortion Detector installed');
});

// 확장 프로그램 아이콘 클릭 시 사이드 패널 열기
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 메시지 라우팅: content script ↔ sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  // content script에서 온 메시지를 사이드 패널로 전달
  if (message.type === 'QUOTE_CLICKED') {
    chrome.runtime.sendMessage({
      type: 'QUOTE_CLICKED_TO_PANEL',
      quoteIndex: message.quoteIndex
    });
    
    // 사이드 패널 열기
    if (sender.tab?.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id });
    }
  }

  // 사이드 패널에서 온 메시지를 content script로 전달
  if (message.type === 'HIGHLIGHT_SETTINGS_CHANGED') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_HIGHLIGHTS',
          settings: message.settings
        });
      }
    });
  }

  // 사이드 패널에서 패널 닫기 요청
  if (message.type === 'CLOSE_PANEL') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.sidePanel.setOptions({ 
          tabId: tabs[0].id, 
          enabled: false 
        });
      }
    });
  }

  return true; // 비동기 응답을 위해 true 반환
});
