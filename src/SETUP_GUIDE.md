# Chrome Extension 설정 가이드

## 📋 개요

React 프로토타입에서 Chrome Extension으로 구조를 변환했습니다.

## 🏗️ 프로젝트 구조

```
프로젝트/
├── manifest.json                     # Chrome Extension Manifest V3
├── package.extension.json            # Extension용 package.json
├── vite.config.extension.ts          # Extension용 Vite 설정
│
├── src/
│   ├── background/
│   │   └── background.ts             # Service Worker
│   │
│   ├── content/
│   │   └── content.tsx               # Content Script (페이지 주입)
│   │
│   ├── sidepanel/
│   │   ├── sidepanel.html           # Side Panel HTML
│   │   ├── sidepanel.tsx            # Entry Point
│   │   └── SidepanelApp.tsx         # Main App
│   │
│   └── shared/                       # 공유 리소스
│       ├── components/               # React 컴포넌트
│       │   ├── ExtensionPanel.tsx
│       │   ├── QuoteCard.tsx
│       │   ├── RadarChart.tsx
│       │   ├── SourceCard.tsx
│       │   ├── SourceCarousel.tsx
│       │   └── SourceModal.tsx
│       ├── data/
│       │   └── quotesData.ts        # 인용문 데이터
│       └── styles/
│           ├── globals.css           # 전역 스타일
│           └── content.css           # Content Script 스타일
│
├── public/
│   └── icons/                        # Extension 아이콘
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       └── icon-128.png
│
├── demo/
│   └── news-article.html            # 테스트용 뉴스 페이지
│
└── dist/                             # 빌드 결과물 (생성됨)
```

## 🚀 빠른 시작

### 1단계: 파일 준비

#### A. quotesData.ts 전체 데이터 복사

현재 `/src/shared/data/quotesData.ts`에 첫 번째 인용문만 있습니다.
기존 `/data/quotesData.ts`의 전체 내용을 복사하세요:

```bash
# 수동으로 복사하거나:
cp data/quotesData.ts src/shared/data/quotesData.ts
```

#### B. 아이콘 파일 준비

`public/icons/` 폴더에 4개의 아이콘 PNG 파일이 필요합니다:
- icon-16.png (16x16px)
- icon-32.png (32x32px)
- icon-48.png (48x48px)
- icon-128.png (128x128px)

**빠른 생성 방법:**
- https://realfavicongenerator.net/ 에서 자동 생성
- 또는 임시로 단색 이미지 사용

### 2단계: 패키지 설정

```bash
# package.json을 extension용으로 교체
cp package.extension.json package.json

# 의존성 설치
npm install

# 타입 정의 추가 설치
npm install -D @types/chrome
```

### 3단계: 빌드

```bash
# 프로덕션 빌드
npm run build

# 개발 중 watch 모드
npm run build:watch
```

빌드 후 `dist/` 폴더에 다음 파일들이 생성됩니다:
- manifest.json
- background.js
- content.js
- sidepanel.html
- sidepanel.js
- content.css
- icons/

### 4단계: Chrome에 로드

1. Chrome 브라우저 열기
2. 주소창에 `chrome://extensions/` 입력
3. 우측 상단 "개발자 모드" 토글 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 버튼 클릭
5. 프로젝트의 `dist/` 폴더 선택

### 5단계: 테스트

#### 방법 1: 데모 페이지 사용
```bash
# demo/news-article.html 파일을 Chrome에서 열기
open demo/news-article.html

# 또는 브라우저에서 직접:
file:///path/to/project/demo/news-article.html
```

#### 방법 2: 실제 뉴스 사이트
1. 아무 뉴스 사이트 방문
2. Chrome 툴바에서 확장 프로그램 아이콘 클릭
3. 사이드 패널이 열림 (현재는 미리 정의된 인용문 표시)

## 🔧 개발 워크플로우

### 코드 수정 시
```bash
# 1. 코드 수정
# 2. 빌드
npm run build

# 3. Chrome에서 확장 프로그램 새로고침
# chrome://extensions/ 페이지에서 새로고침 버튼 클릭

# 4. 테스트
# 페이지 새로고침 필요 (content script 변경 시)
```

### Hot Reload 설정 (선택사항)
```bash
# watch 모드로 자동 빌드
npm run build:watch

# Chrome Extension Reloader 설치
# https://chromewebstore.google.com/detail/fimgfedafeadlieiabdeeaodndnlbhid
```

## 🐛 디버깅

### Content Script 디버깅
- 뉴스 페이지에서 `F12` → Console 탭
- 인용문 하이라이트 확인

### Background Service Worker 디버깅
- `chrome://extensions/` 페이지
- "서비스 워커" 링크 클릭
- Console에서 메시지 로그 확인

### Side Panel 디버깅
- 사이드 패널에서 마우스 우클릭
- "검사" 또는 "Inspect" 선택
- DevTools 열림

## 📝 주요 파일 설명

### manifest.json
```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "storage", "sidePanel"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["content.css"]
  }],
  "side_panel": { "default_path": "sidepanel.html" }
}
```

### 메시지 흐름
```
Content Script (페이지)
    ↓ QUOTE_CLICKED
Background Service Worker
    ↓ QUOTE_CLICKED_TO_PANEL
Side Panel (React App)
    ↓ HIGHLIGHT_SETTINGS_CHANGED
Background Service Worker
    ↓ UPDATE_HIGHLIGHTS
Content Script (페이지)
```

## ⚙️ 환경별 설정

### 개발 환경
```typescript
// vite.config.extension.ts
export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
  },
});
```

### 프로덕션 환경
```typescript
// vite.config.extension.ts
export default defineConfig({
  build: {
    minify: true,
    sourcemap: false,
  },
});
```

## 🔍 트러블슈팅

### 문제: "Manifest file is missing or unreadable"
**해결:** `npm run build` 후 `dist/manifest.json`이 복사되었는지 확인

### 문제: Content Script가 작동하지 않음
**해결:** 
1. 페이지 새로고침
2. Chrome 확장 프로그램 새로고침
3. Console에서 에러 확인

### 문제: Side Panel이 열리지 않음
**해결:**
1. Chrome 버전이 114 이상인지 확인 (Side Panel API 지원)
2. manifest.json에 "sidePanel" 권한 확인
3. Background Service Worker 콘솔 확인

### 문제: 아이콘이 표시되지 않음
**해결:**
1. `public/icons/` 폴더에 모든 아이콘 파일 존재 확인
2. `npm run copy:icons` 실행
3. `dist/icons/` 폴더 확인

## 📚 다음 단계

### 1. 실제 인용문 감지 구현
현재는 미리 정의된 인용문을 사용합니다. 
실제 환경에서는:
- Python 정규식 로직을 JavaScript로 변환
- 페이지 텍스트를 분석하여 인용문 자동 감지
- API 연동하여 왜곡 점수 계산

### 2. 저장소 기능 추가
```typescript
// chrome.storage API 사용
chrome.storage.local.set({ quotes: detectedQuotes });
chrome.storage.local.get(['quotes'], (result) => {
  console.log(result.quotes);
});
```

### 3. 배포
- Chrome Web Store에 업로드
- 스크린샷 및 설명 준비
- 개인정보 처리방침 작성

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Chrome DevTools Console
2. Background Service Worker Console
3. 이 문서의 트러블슈팅 섹션

## 📄 라이선스
MIT
