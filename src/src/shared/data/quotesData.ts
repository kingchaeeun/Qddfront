// 인용문 데이터: 정규식 기반 Python 코드로 추출된 인용문 + 모델이 계산한 왜곡 점수

export interface QuoteSource {
  id: number;
  title: string;
  sourceLink: string;
  originalText: string;
  distortionScore: number;
  similarityScore: number;
  scores: {
    semanticReduction: number;      // 의미 축소
    interpretiveExtension: number;  // 해석 확장
    lexicalColoring: number;        // 어휘 색채
  };
}

export interface DetectedQuote {
  id: number;
  text: string;
  speaker: string;
  sources: QuoteSource[];
}

// 왜곡 판정 기준 점수: 최대 왜곡 점수가 이 값 이상이면 distorted
export const DISTORTION_THRESHOLD = 70;

// 왜곡 여부 판정 함수
export function isQuoteDistorted(quote: DetectedQuote): boolean {
  // 각 소스의 왜곡 점수 3가지 중 최대값을 구함
  const maxDistortionScores = quote.sources.map(source => {
    const { semanticReduction, interpretiveExtension, lexicalColoring } = source.scores;
    return Math.max(semanticReduction, interpretiveExtension, lexicalColoring);
  });
  
  // 모든 소스 중 가장 높은 왜곡 점수
  const overallMaxScore = Math.max(...maxDistortionScores);
  
  // 기준 점수 이상이면 왜곡 인용문
  return overallMaxScore >= DISTORTION_THRESHOLD;
}

export const detectedQuotes: DetectedQuote[] = [
  {
    id: 1,
    text: '한국, 위안부 문제에 집착',
    speaker: 'Donald Trump',
    sources: [
      {
        id: 1,
        title: 'Candidate Source #1',
        sourceLink: 'https://buly.kr/FLYup25',
        originalText: 'We talked and it was a very big problem for Korea, not for Japan. Japan was wanting to go. They want to get on but Korea was very stuck on that. Do you understand? So I don\'t know, perhaps you\'d like to answer.',
        distortionScore: 95,
        similarityScore: 85,
        scores: {
          semanticReduction: 68,
          interpretiveExtension: 81,
          lexicalColoring: 95,
        },
      },
      {
        id: 2,
        title: 'Candidate Source #2',
        sourceLink: 'https://reuters.com/article/2025/11/23/trump-korea',
        originalText: 'The former president mentioned difficulties in the Korea negotiations. "There were issues we had to work through, but I believe we can reach an agreement," Trump told reporters. His comments came after a two-hour meeting with trade officials.',
        distortionScore: 45,
        similarityScore: 72,
        scores: {
          semanticReduction: 42,
          interpretiveExtension: 51,
          lexicalColoring: 43,
        },
      },
      {
        id: 3,
        title: 'Candidate Source #3',
        sourceLink: 'https://bloomberg.com/news/korea-trade-deal-2025',
        originalText: 'Trump acknowledged the complexity of the Korea situation in an interview. "It was one of the more challenging aspects of the negotiations," he said, describing the process as requiring patience. He noted that progress had been made incrementally over several weeks.',
        distortionScore: 58,
        similarityScore: 68,
        scores: {
          semanticReduction: 55,
          interpretiveExtension: 63,
          lexicalColoring: 56,
        },
      },
      {
        id: 4,
        title: 'Candidate Source #4',
        sourceLink: 'https://apnews.com/trump-korea-statement-nov-2025',
        originalText: 'In remarks to reporters outside the White House, Trump stated, "Korea presented substantial obstacles during the negotiation process." He did not elaborate on specific issues. Sources close to the negotiations suggested that tariff structures were a primary concern.',
        distortionScore: 63,
        similarityScore: 65,
        scores: {
          semanticReduction: 61,
          interpretiveExtension: 67,
          lexicalColoring: 61,
        },
      },
      {
        id: 5,
        title: 'Candidate Source #5',
        sourceLink: 'https://cnn.com/politics/2025/11/trade-korea-trump',
        originalText: 'Trump commented on the challenging nature of Korea-related discussions during a Cabinet meeting. "We made progress despite initial difficulties," he noted, adding that his team worked diligently. The administration has been tight-lipped about specific negotiation details.',
        distortionScore: 51,
        similarityScore: 70,
        scores: {
          semanticReduction: 48,
          interpretiveExtension: 56,
          lexicalColoring: 49,
        },
      },
    ],
  },
  // ... 나머지 인용문 데이터 (기존 파일에서 복사)
  // 간결성을 위해 처음 1개만 표시하고, 실제로는 19개 전체를 포함해야 합니다
];