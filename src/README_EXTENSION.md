# Quote Distortion Detector - Chrome Extension

뉴스 기사에서 인용문 왜곡을 감지하는 Chrome 확장 프로그램

## 프로젝트 구조

```
quote-distortion-detector/
├── manifest.json                    # Chrome Extension Manifest V3
├── public/
│   └── icons/                       # 확장 프로그램 아이콘
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       └── icon-128.png
├── src/
│   ├── background/
│   │   └── background.ts            # Background Service Worker
│   ├── content/
│   │   └── content.tsx              # Content Script (페이지 주입)
│   ├── sidepanel/
│   │   ├── sidepanel.html          # Side Panel HTML
│   │   ├── sidepanel.tsx           # Side Panel Entry Point
│   │   └── SidepanelApp.tsx        # Side Panel React App
│   └── shared/
│       ├── components/              # 공유 React 컴포넌트
│       │   ├── ExtensionPanel.tsx
│       │   ├── QuoteCard.tsx
│       │   ├── RadarChart.tsx
│       │   ├── SourceCard.tsx
│       │   ├── SourceCarousel.tsx
│       │   └── SourceModal.tsx
│       ├── data/
│       │   └── quotesData.ts       # 인용문 데이터
│       └── styles/
│           ├── globals.css          # 전역 스타일
│           └── content.css          # Content Script 스타일
└── dist/                            # 빌드 결과물 (생성됨)
```

## 주요 기능

### 1. Content Script (`src/content/content.tsx`)
- 뉴스 페이지에 자동으로 주입
- 인용문 감지 및 하이라이트
- 각주 번호 표시
- 호버 효과
- 인용문 클릭 시 사이드 패널 열기

### 2. Side Panel (`src/sidepanel/`)
- 420px 고정 너비 패널
- 감지된 인용문 표시
- 5개의 후보 원문 소스
- 레이더 차트로 왜곡 점수 시각화
- 하이라이트 설정 (distorted/normal)

### 3. Background Service Worker (`src/background/background.ts`)
- Content Script ↔ Side Panel 메시지 라우팅
- 확장 프로그램 아이콘 클릭 처리
- 사이드 패널 열기/닫기 제어

## 빌드 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 빌드 도구 설정

`webpack.config.js` 또는 `vite.config.ts` 파일 필요:

**Vite 예제 (권장):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.tsx'),
        sidepanel: resolve(__dirname, 'src/sidepanel/sidepanel.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
```

### 3. 빌드 실행
```bash
npm run build
```

### 4. Chrome에 로드

1. Chrome 주소창에 `chrome://extensions/` 입력
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

## 데이터 구조

### DetectedQuote
```typescript
interface DetectedQuote {
  id: number;
  text: string;            // 인용문 텍스트
  speaker: string;         // 발언자
  sources: QuoteSource[];  // 후보 원문 소스 (5개)
}
```

### QuoteSource
```typescript
interface QuoteSource {
  id: number;
  title: string;
  sourceLink: string;
  originalText: string;
  distortionScore: number;      // 왜곡 점수
  similarityScore: number;      // 유사도 점수
  scores: {
    semanticReduction: number;      // 의미 축소
    interpretiveExtension: number;  // 해석 확장
    lexicalColoring: number;        // 어휘 색채
  };
}
```

## 왜곡 판정 로직

```typescript
// 왜곡 기준 점수
const DISTORTION_THRESHOLD = 70;

// 각 소스의 3가지 세부 점수 중 최대값을 구하고,
// 모든 소스 중 가장 높은 점수가 기준 이상이면 왜곡으로 판정
function isQuoteDistorted(quote: DetectedQuote): boolean {
  const maxDistortionScores = quote.sources.map(source => {
    return Math.max(
      source.scores.semanticReduction,
      source.scores.interpretiveExtension,
      source.scores.lexicalColoring
    );
  });
  
  const overallMaxScore = Math.max(...maxDistortionScores);
  return overallMaxScore >= DISTORTION_THRESHOLD;
}
```

## 메시지 통신

### Content Script → Background
```typescript
chrome.runtime.sendMessage({
  type: 'QUOTE_CLICKED',
  quoteIndex: 0
});
```

### Background → Side Panel
```typescript
chrome.runtime.sendMessage({
  type: 'QUOTE_CLICKED_TO_PANEL',
  quoteIndex: 0
});
```

### Side Panel → Content Script (via Background)
```typescript
chrome.runtime.sendMessage({
  type: 'HIGHLIGHT_SETTINGS_CHANGED',
  settings: { distorted: true, normal: false }
});
```

## 개발 팁

### 1. Hot Reload
개발 중에는 코드 변경 시:
1. `npm run build` 재실행
2. Chrome 확장 프로그램 페이지에서 새로고침 버튼 클릭

### 2. 디버깅
- **Content Script**: 웹 페이지의 개발자 도구 콘솔
- **Background**: `chrome://extensions/` → "서비스 워커" 클릭
- **Side Panel**: 사이드 패널에서 마우스 우클릭 → "검사"

### 3. 실제 환경 적용
- 현재는 데모 데이터를 사용
- 실제 환경에서는:
  1. Python 정규식 로직을 JavaScript로 변환
  2. 인용문 자동 감지 구현
  3. 백엔드 API와 연동하여 왜곡 점수 계산

## 라이선스
MIT
