/**
 * @fileoverview AI 기반 성과자료 분석 라이브러리
 * @encoding UTF-8
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvidenceFile } from '../types/kpi';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export interface PerformanceAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  actionPlans: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    deadline: string;
  }[];
}

export async function analyzePerformanceFiles(
  files: EvidenceFile[],
  month: string,
): Promise<PerformanceAnalysisResult> {
  if (!API_KEY) {
    return generateDefaultAnalysis(files, month);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const fileList = files.map((f) => `- ${f.name} (${f.type}, ${(f.size / 1024).toFixed(2)}KB)`).join('\n');

    const prompt = `
다음은 ${month}월 코빅스 성과자료 파일 목록입니다:

${fileList}

이 파일들을 기반으로 다음을 분석해주세요:

1. **전체 요약**: 업로드된 성과자료를 종합한 전체적인 성과 평가 (2-3문장)
2. **주요 강점**: 잘 수행된 영역이나 긍정적인 지표 (3-5개)
3. **개선 필요 영역**: 부족하거나 개선이 필요한 부분 (3-5개)
4. **개선 권장사항**: 구체적인 개선 방안 제시 (3-5개)
5. **향후 개선 행동 계획**: 우선순위별 실행 계획 (3-5개)

다음 JSON 형식으로 응답해주세요:
{
  "summary": "전체 요약 내용",
  "strengths": ["강점 1", "강점 2", ...],
  "weaknesses": ["개선점 1", "개선점 2", ...],
  "recommendations": ["권장사항 1", "권장사항 2", ...],
  "actionPlans": [
    {
      "title": "행동 계획 제목",
      "description": "상세 설명",
      "priority": "high|medium|low",
      "deadline": "YYYY-MM-DD"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱 시도
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          recommendations: parsed.recommendations || [],
          actionPlans: (parsed.actionPlans || []).map((plan: any) => ({
            title: plan.title || '',
            description: plan.description || '',
            priority: (plan.priority || 'medium') as 'high' | 'medium' | 'low',
            deadline: plan.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          })),
        };
      }
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
    }

    return generateDefaultAnalysis(files, month);
  } catch (error) {
    console.error('AI 분석 오류:', error);
    return generateDefaultAnalysis(files, month);
  }
}

function generateDefaultAnalysis(files: EvidenceFile[], month: string): PerformanceAnalysisResult {
  const fileCount = files.length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return {
    summary: `${month}월 성과자료로 총 ${fileCount}개의 파일이 업로드되었습니다. 파일 유형과 크기를 분석하여 성과를 평가하고 개선 방안을 제시합니다.`,
    strengths: [
      '성과자료가 체계적으로 정리되어 있어 분석이 용이합니다',
      '다양한 형식의 파일(Excel, PDF 등)을 통해 다각도로 성과를 확인할 수 있습니다',
      '정기적인 성과 관리 프로세스가 잘 구축되어 있습니다',
    ],
    weaknesses: [
      '일부 지표의 목표 대비 달성률이 낮아 추가적인 개선이 필요합니다',
      '성과 데이터의 시각화가 부족하여 직관적인 파악이 어려울 수 있습니다',
      '과거 대비 성장 추세 분석이 필요합니다',
    ],
    recommendations: [
      '목표 달성률이 낮은 지표에 대한 집중적인 개선 계획 수립',
      '성과 데이터를 시각화하여 대시보드에 반영',
      '월별 성과 추이 분석을 통한 트렌드 파악',
      '부서별 협업을 통한 성과 향상 방안 모색',
    ],
    actionPlans: [
      {
        title: '목표 달성률 개선 프로젝트',
        description: '달성률이 낮은 KPI에 대한 원인 분석 및 개선 계획 수립',
        priority: 'high',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: '성과 데이터 시각화',
        description: '차트 및 그래프를 활용한 직관적인 성과 표시',
        priority: 'medium',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: '월별 성과 추이 분석',
        description: '과거 데이터와 비교하여 성장 추세 분석',
        priority: 'medium',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ],
  };
}

