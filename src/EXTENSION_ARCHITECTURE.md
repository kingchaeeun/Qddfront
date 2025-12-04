# Chrome Extension 아키텍처 설명

## 🎯 전체 구조 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Browser                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐  ┌────────────────────────┐   │
│  │    뉴스 페이지 탭         │  │   Side Panel (420px)   │   │
│  │                          │  │                        │   │
│  │  일반 웹 콘텐츠           │  │  ┌──────────────────┐  │   │
│  │  ┌────────────────┐      │  │  │ ExtensionPanel   │  │   │
│  │  │ 인용문 하이라이트 │←─┐  │  │  │                  │  │   │
│  │  │  "한국, 위안부   │  │  │  │  │ • Quote Cards    │  │   │
│  │  │   문제에 집착"¹  │  │  │  │  │ • Source Carousel│  │   │
│  │  └────────────────┘  │  │  │  │ • Radar Charts   │  │   │
│  │  (Content Script)   │  │  │  │ • Settings       │  │   │
│  │                      │  │  │  └──────────────────┘  │   │
│  └──────────────────────┘  │  └────────────────────────┘   │
│            ↑               │              ↑                 │
│            │               └──────────────┘                 │
│            │            Message Passing                     │
│            ↓                                                │
│  ┌─────────────────────────────────────────────────┐       │
│  │        Background Service Worker                 │       │
│  │  • 메시지 라우팅                                  │       │
│  │  • Content ↔ Sidepanel 통신                     │       │
│  │  • Extension 아이콘 클릭 처리                     │       │
│  └─────────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 컴포넌트 상세 설명

### 1. Content Script (`src/content/content.tsx`)

**역할:** 뉴스 페이지에 직접 주입되어 인용문을 감지하고 하이라이트

**주요 기능:**
```typescript
class QuoteDetector {
  // 페이지 로드 시 인용문 감지
  detectAndHighlight() {
    detectedQuotes.forEach((quote, index) => {
      // TreeWalker로 텍스트 노드 탐색
      // 인용문 텍스트 발견 시 <span> 태그로 감싸기
      // 각주 번호 추가
    });
  }

  // 인용문 클릭 시
  handleQuoteClick(quoteIndex) {
    // Background에 메시지 전송
    chrome.runtime.sendMessage({
      type: 'QUOTE_CLICKED',
      quoteIndex: quoteIndex
    });
  }

  // Side Panel에서 설정 변경 시
  updateHighlights(settings) {
    // distorted/normal 인용문 표시 여부 업데이트
  }
}
```

**스타일:** `src/shared/styles/content.css`
```css
.quote-highlight-visible {
  background-color: #fef08a; /* yellow-200 */
  cursor: pointer;
}

.quote-number {
  font-size: 10px;
  vertical-align: super;
}
```

**생명주기:**
1. 페이지 로드 → `DOMContentLoaded` 이벤트
2. 인용문 감지 및 하이라이트
3. 클릭 이벤트 리스너 등록
4. 메시지 리스너 등록 (설정 업데이트용)

---

### 2. Background Service Worker (`src/background/background.ts`)

**역할:** 확장 프로그램의 중앙 허브, 메시지 라우팅

**주요 기능:**
```typescript
// 확장 프로그램 아이콘 클릭
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// 메시지 라우팅
chrome.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case 'QUOTE_CLICKED':
      // Content → Sidepanel
      chrome.runtime.sendMessage({
        type: 'QUOTE_CLICKED_TO_PANEL',
        quoteIndex: message.quoteIndex
      });
      break;
      
    case 'HIGHLIGHT_SETTINGS_CHANGED':
      // Sidepanel → Content
      chrome.tabs.sendMessage(tabId, {
        type: 'UPDATE_HIGHLIGHTS',
        settings: message.settings
      });
      break;
  }
});
```

**특징:**
- Manifest V3의 Service Worker (항상 실행 X, 필요 시 활성화)
- Event-driven 아키텍처
- 상태를 저장하지 않음 (chrome.storage 사용)

---

### 3. Side Panel (`src/sidepanel/`)

**역할:** 420px 고정 너비 패널, UI 표시

#### SidepanelApp.tsx (Main Container)
```typescript
export default function SidepanelApp() {
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [highlightSettings, setHighlightSettings] = useState({
    distorted: true,
    normal: false,
  });

  // Content Script로부터 메시지 수신
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'QUOTE_CLICKED_TO_PANEL') {
        setSelectedQuoteIndex(message.quoteIndex);
      }
    });
  }, []);

  // 설정 변경 시 Content Script에 전송
  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'HIGHLIGHT_SETTINGS_CHANGED',
      settings: highlightSettings,
    });
  }, [highlightSettings]);

  return (
    <ExtensionPanel
      initialQuoteIndex={selectedQuoteIndex}
      highlightSettings={highlightSettings}
      onHighlightSettingsChange={setHighlightSettings}
    />
  );
}
```

#### ExtensionPanel.tsx (UI Component)
- Quote Card (인용문 표시)
- Source Carousel (5개 후보 소스)
- Radar Chart (왜곡 점수 시각화)
- Settings Dropdown (하이라이트 설정)

**컴포넌트 계층:**
```
SidepanelApp
└── ExtensionPanel
    ├── QuoteCard
    │   └── 인용문 텍스트 + 발언자
    └── SourceCarousel
        ├── SourceCard (x5)
        │   ├── 원문 링크
        │   ├── 원문 텍스트 (번역 토글)
        │   ├── 유사도 점수 바
        │   ├── 왜곡 점수 바
        │   └── RadarChart
        │       └── Recharts 육각형 차트
        └── Pagination Dots
```

---

### 4. Shared Components (`src/shared/components/`)

모든 React 컴포넌트는 Content Script와 Side Panel 모두에서 사용 가능:

```typescript
// ExtensionPanel.tsx - 메인 패널 레이아웃
// QuoteCard.tsx - 인용문 카드
// SourceCard.tsx - 원문 소스 카드
// SourceCarousel.tsx - 5개 소스 캐러셀
// RadarChart.tsx - 왜곡 점수 시각화
// SourceModal.tsx - 원문 상세 모달
```

---

### 5. Data Layer (`src/shared/data/quotesData.ts`)

**데이터 구조:**
```typescript
interface DetectedQuote {
  id: number;
  text: string;            // "한국, 위안부 문제에 집착"
  speaker: string;         // "Donald Trump"
  sources: QuoteSource[];  // 5개 후보 소스
}

interface QuoteSource {
  id: number;
  title: string;
  sourceLink: string;
  originalText: string;
  distortionScore: number;      // 총 왜곡 점수 (0-100)
  similarityScore: number;      // 유사도 점수 (0-100)
  scores: {
    semanticReduction: number;      // 의미 축소 (0-100)
    interpretiveExtension: number;  // 해석 확장 (0-100)
    lexicalColoring: number;        // 어휘 색채 (0-100)
  };
}
```

**왜곡 판정 로직:**
```typescript
const DISTORTION_THRESHOLD = 70;

function isQuoteDistorted(quote: DetectedQuote): boolean {
  // 각 소스의 3가지 세부 점수 중 최대값
  const maxScores = quote.sources.map(source => 
    Math.max(
      source.scores.semanticReduction,
      source.scores.interpretiveExtension,
      source.scores.lexicalColoring
    )
  );
  
  // 모든 소스 중 가장 높은 점수가 70 이상이면 왜곡
  return Math.max(...maxScores) >= DISTORTION_THRESHOLD;
}
```

---

## 🔄 메시지 흐름 (Message Flow)

### 시나리오 1: 사용자가 페이지에서 인용문 클릭

```
1. Content Script
   ↓ chrome.runtime.sendMessage()
   { type: 'QUOTE_CLICKED', quoteIndex: 0 }

2. Background Service Worker
   ↓ chrome.runtime.sendMessage()
   { type: 'QUOTE_CLICKED_TO_PANEL', quoteIndex: 0 }

3. Side Panel
   ↓ setSelectedQuoteIndex(0)
   UI 업데이트: 해당 인용문으로 이동
```

### 시나리오 2: 사용자가 Side Panel에서 하이라이트 설정 변경

```
1. Side Panel
   ↓ chrome.runtime.sendMessage()
   { type: 'HIGHLIGHT_SETTINGS_CHANGED', settings: {...} }

2. Background Service Worker
   ↓ chrome.tabs.sendMessage()
   { type: 'UPDATE_HIGHLIGHTS', settings: {...} }

3. Content Script
   ↓ updateHighlights()
   페이지의 하이라이트 표시/숨김 업데이트
```

---

## 🎨 스타일 시스템

### Tailwind CSS 4.0
```css
/* globals.css */
:root {
  --color-primary: #3D5AFE;
  --radius: 0.625rem;
}

/* 조건부 색상 */
.score-high { color: red-600; }      /* ≥ 85 */
.score-medium { color: orange-600; } /* 70-84 */
.score-low { color: blue-600; }      /* < 70 */
```

### 반응형 디자인
- Side Panel: 고정 420px
- Content Script: 페이지 너비에 맞춤
- Mobile: 현재 미지원 (데스크톱 전용)

---

## 🔐 권한 (Permissions)

```json
{
  "permissions": [
    "activeTab",    // 현재 탭에 접근
    "storage",      // 설정 저장
    "sidePanel"     // Side Panel API 사용
  ],
  "host_permissions": [
    "http://*/*",   // 모든 HTTP 페이지
    "https://*/*"   // 모든 HTTPS 페이지
  ]
}
```

---

## 📊 성능 고려사항

### Content Script 최적화
```typescript
// ❌ 나쁜 예: 모든 텍스트 노드를 매번 검색
document.body.innerHTML.replace(...)

// ✅ 좋은 예: TreeWalker로 효율적 탐색
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT
);
```

### Background Service Worker
- 이벤트 기반으로 동작 (항상 실행 X)
- 30초 비활성 후 자동 종료
- 상태는 chrome.storage에 저장

### Side Panel
- React 컴포넌트 메모이제이션
- 큰 데이터는 가상 스크롤 고려
- 이미지 lazy loading

---

## 🧪 테스트 전략

### 1. Content Script 테스트
```javascript
// demo/news-article.html 사용
// Console에서 확인:
console.log(document.querySelectorAll('.quote-highlight').length);
```

### 2. Message Passing 테스트
```javascript
// Background Console에서:
chrome.runtime.onMessage.addListener((msg) => {
  console.log('Message:', msg);
});
```

### 3. UI 테스트
- Side Panel DevTools로 React 컴포넌트 검사
- 다양한 왜곡 점수로 색상 확인

---

## 🚀 배포 체크리스트

### 빌드 전
- [ ] quotesData.ts 전체 데이터 복사
- [ ] 아이콘 파일 4개 준비
- [ ] manifest.json 버전 업데이트
- [ ] README 작성

### 빌드
```bash
npm run build
```

### 확인 사항
- [ ] dist/manifest.json 존재
- [ ] dist/background.js, content.js, sidepanel.js 생성
- [ ] dist/icons/ 폴더 존재
- [ ] dist/content.css 존재

### Chrome Web Store 준비
- [ ] 128x128 프로모션 이미지
- [ ] 스크린샷 5장
- [ ] 설명 (한글/영문)
- [ ] 개인정보 처리방침

---

## 📚 참고 자료

### Chrome Extension API
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)

### 프로젝트 구조
- [React + Vite](https://vitejs.dev/guide/)
- [Tailwind CSS 4.0](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

---

## 💡 향후 개선 사항

### 기능 추가
1. **실시간 인용문 감지**
   - Python 로직 → JavaScript 변환
   - NLP 라이브러리 통합

2. **사용자 피드백**
   - 왜곡 판정에 대한 동의/비동의
   - 커뮤니티 평가 시스템

3. **다국어 지원**
   - 영어, 한국어 외 추가 언어
   - i18n 라이브러리 통합

### 성능 개선
1. **캐싱**
   - chrome.storage로 분석 결과 캐시
   - IndexedDB 사용 고려

2. **청크 로딩**
   - 큰 페이지는 부분별로 분석
   - Web Worker 활용

3. **오프라인 지원**
   - Service Worker 캐시
   - 로컬 모델 사용

---

## 🔧 문제 해결

### "Service worker registration failed"
→ background.ts 빌드 에러 확인

### "Cannot read property of undefined"
→ quotesData.ts 전체 데이터 복사 확인

### "Side panel not opening"
→ Chrome 버전 114+ 필요

### "Content script not injecting"
→ manifest.json의 host_permissions 확인

---

이 문서는 Chrome Extension의 전체 아키텍처를 설명합니다.
더 자세한 내용은 `SETUP_GUIDE.md`와 `README_EXTENSION.md`를 참조하세요.
