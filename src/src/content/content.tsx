// Content Script: 뉴스 페이지에 인용문 하이라이트 및 번호 주입
import { createRoot } from 'react-dom/client';
import { detectedQuotes, isQuoteDistorted } from '../shared/data/quotesData';
import '../shared/styles/content.css';

interface HighlightSettings {
  distorted: boolean;
  normal: boolean;
}

class QuoteDetector {
  private highlightSettings: HighlightSettings = {
    distorted: true,
    normal: false,
  };

  constructor() {
    this.init();
    this.setupMessageListener();
  }

  private init() {
    // DOM이 완전히 로드된 후 인용문 감지 및 하이라이트
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.detectAndHighlight());
    } else {
      this.detectAndHighlight();
    }
  }

  private setupMessageListener() {
    // 사이드 패널로부터 하이라이트 설정 업데이트 받기
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'UPDATE_HIGHLIGHTS') {
        this.highlightSettings = message.settings;
        this.updateHighlights();
      }
    });
  }

  private detectAndHighlight() {
    // 실제 환경에서는 정규식 기반 Python 로직을 JS로 변환하여 인용문 감지
    // 데모를 위해 미리 정의된 인용문 데이터를 사용하여 페이지에서 텍스트 찾아 하이라이트

    const bodyText = document.body.innerText;

    detectedQuotes.forEach((quote, index) => {
      this.highlightQuoteInPage(quote.text, index);
    });
  }

  private highlightQuoteInPage(quoteText: string, quoteIndex: number) {
    const quote = detectedQuotes[quoteIndex];
    const isDistorted = isQuoteDistorted(quote);

    // TreeWalker를 사용하여 텍스트 노드 탐색
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToReplace: { node: Text; start: number; end: number }[] = [];

    let currentNode: Text | null;
    while ((currentNode = walker.nextNode() as Text)) {
      const text = currentNode.textContent || '';
      const index = text.indexOf(quoteText);

      if (index !== -1) {
        nodesToReplace.push({
          node: currentNode,
          start: index,
          end: index + quoteText.length,
        });
      }
    }

    // 찾은 텍스트 노드를 하이라이트된 요소로 교체
    nodesToReplace.forEach(({ node, start, end }) => {
      const parent = node.parentNode;
      if (!parent) return;

      const beforeText = node.textContent!.substring(0, start);
      const matchText = node.textContent!.substring(start, end);
      const afterText = node.textContent!.substring(end);

      const wrapper = document.createElement('span');
      wrapper.className = 'quote-highlight';
      wrapper.dataset.quoteIndex = String(quoteIndex);
      wrapper.dataset.isDistorted = String(isDistorted);
      wrapper.textContent = matchText;

      // 각주 번호 추가
      const sup = document.createElement('sup');
      sup.className = 'quote-number';
      sup.textContent = String(quoteIndex + 1);
      wrapper.appendChild(sup);

      // 클릭 이벤트 추가
      wrapper.addEventListener('click', () => {
        this.handleQuoteClick(quoteIndex);
      });

      // 호버 효과를 위한 클래스 추가
      wrapper.addEventListener('mouseenter', () => {
        wrapper.classList.add('quote-highlight-hover');
      });
      wrapper.addEventListener('mouseleave', () => {
        wrapper.classList.remove('quote-highlight-hover');
      });

      // 텍스트 노드 교체
      if (beforeText) parent.insertBefore(document.createTextNode(beforeText), node);
      parent.insertBefore(wrapper, node);
      if (afterText) parent.insertBefore(document.createTextNode(afterText), node);
      parent.removeChild(node);
    });

    this.updateHighlights();
  }

  private updateHighlights() {
    // 모든 하이라이트된 요소의 표시 여부 업데이트
    const highlights = document.querySelectorAll('.quote-highlight');
    highlights.forEach((element) => {
      const isDistorted = element.getAttribute('data-is-distorted') === 'true';
      const shouldShow = isDistorted ? this.highlightSettings.distorted : this.highlightSettings.normal;

      if (shouldShow) {
        element.classList.add('quote-highlight-visible');
      } else {
        element.classList.remove('quote-highlight-visible');
      }
    });
  }

  private handleQuoteClick(quoteIndex: number) {
    // 사이드 패널에 인용문 클릭 이벤트 전달
    chrome.runtime.sendMessage({
      type: 'QUOTE_CLICKED',
      quoteIndex: quoteIndex,
    });
  }
}

// Content script 초기화
new QuoteDetector();
