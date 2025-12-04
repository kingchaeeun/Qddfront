# Extension Icons

크롬 확장 프로그램용 아이콘 파일들이 필요합니다.

## 필요한 아이콘

다음 크기의 PNG 파일들을 이 폴더에 추가하세요:

- `icon-16.png` - 16x16px (툴바 아이콘)
- `icon-32.png` - 32x32px (Windows용)
- `icon-48.png` - 48x48px (확장 프로그램 관리 페이지)
- `icon-128.png` - 128x128px (Chrome 웹 스토어)

## 아이콘 디자인 가이드

### 컨셉
- 인용문(Quote)을 상징하는 따옴표 기호
- 왜곡 감지를 나타내는 돋보기 또는 경고 표시
- 브랜드 컬러: #3D5AFE (파란색)

### 추천 도구
- Figma (벡터 디자인)
- Adobe Illustrator
- Canva (간단한 디자인)
- 온라인 아이콘 생성기

### 임시 아이콘 생성
개발 중에는 임시 아이콘을 사용할 수 있습니다:

1. https://www.favicon-generator.org/ 방문
2. 텍스트나 이미지 업로드
3. 다양한 크기로 자동 생성
4. 다운로드하여 이 폴더에 배치

## 빠른 생성 방법

### 방법 1: 온라인 도구
```
https://realfavicongenerator.net/
- 하나의 큰 이미지만 업로드하면 모든 크기 자동 생성
```

### 방법 2: ImageMagick 사용
```bash
# 큰 이미지(512x512)에서 모든 크기 생성
convert source.png -resize 16x16 icon-16.png
convert source.png -resize 32x32 icon-32.png
convert source.png -resize 48x48 icon-48.png
convert source.png -resize 128x128 icon-128.png
```

### 방법 3: 단색 플레이스홀더
개발 테스트용으로 단색 이미지 사용:
```html
<!-- HTML Canvas로 생성 가능 -->
<canvas width="128" height="128"></canvas>
```
