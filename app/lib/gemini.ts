/**
 * @fileoverview Gemini AI 연동 라이브러리
 * @encoding UTF-8
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Executive, AnalysisResult, ActionPlan } from '../types/kpi';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function analyzeKPI(executive: Executive): Promise<AnalysisResult> {
  if (!API_KEY) {
    // API 키가 없을 경우 기본 분석 결과 반환
    return generateDefaultAnalysis(executive);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
다음은 ${executive.name} ${executive.position}의 KPI 데이터입니다:

${executive.kpis
  .map(
    (kpi) => `
- ${kpi.name}: 목표 ${kpi.target}${kpi.unit}, 현재 ${kpi.current}${kpi.unit} (달성률 ${((kpi.current / kpi.target) * 100).toFixed(1)}%)
  상태: ${kpi.status === 'on-track' ? '정상' : kpi.status === 'at-risk' ? '주의' : '위험'}
  추세: ${kpi.trend === 'up' ? '상승' : kpi.trend === 'down' ? '하락' : '유지'}
`,
  )
  .join('')}

위 데이터를 분석하여 다음 형식으로 JSON 응답을 제공해주세요:
{
  "summary": "전체 요약 (2-3문장)",
  "insights": ["인사이트 1", "인사이트 2", "인사이트 3"],
  "recommendations": ["권장사항 1", "권장사항 2", "권장사항 3"],
  "actionPlans": [
    {
      "title": "실행 계획 제목",
      "description": "상세 설명",
      "priority": "high|medium|low",
      "dueDate": "YYYY-MM-DD"
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
          insights: parsed.insights || [],
          recommendations: parsed.recommendations || [],
          actionPlans: (parsed.actionPlans || []).map((plan: any, index: number) => ({
            id: `plan-${Date.now()}-${index}`,
            kpiId: executive.kpis[0]?.id || '',
            title: plan.title || '',
            description: plan.description || '',
            priority: plan.priority || 'medium',
            dueDate: plan.dueDate || new Date().toISOString(),
            status: 'pending' as const,
          })),
        };
      }
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
    }

    // 파싱 실패 시 기본 분석 반환
    return generateDefaultAnalysis(executive);
  } catch (error) {
    console.error('Gemini AI 분석 오류:', error);
    return generateDefaultAnalysis(executive);
  }
}

function generateDefaultAnalysis(executive: Executive): AnalysisResult {
  const atRiskKPIs = executive.kpis.filter((kpi) => kpi.status !== 'on-track');
  const overallProgress =
    executive.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) /
    executive.kpis.length;

  return {
    summary: `${executive.name} ${executive.position}의 전체 KPI 달성률은 평균 ${overallProgress.toFixed(1)}%입니다. ${atRiskKPIs.length}개의 KPI가 목표 달성에 어려움을 겪고 있습니다.`,
    insights: [
      `${executive.kpis.filter((k) => k.trend === 'up').length}개의 KPI가 상승 추세를 보이고 있습니다.`,
      `${atRiskKPIs.length}개의 KPI가 주의가 필요합니다.`,
      `가장 낮은 달성률을 보이는 KPI는 ${executive.kpis.sort((a, b) => (a.current / a.target) - (b.current / b.target))[0]?.name}입니다.`,
    ],
    recommendations: [
      '목표 달성률이 낮은 KPI에 대한 집중적인 개선 계획 수립이 필요합니다.',
      '상승 추세를 보이는 KPI의 성공 요인을 분석하여 다른 KPI에 적용하세요.',
      '정기적인 모니터링과 피드백 루프를 구축하여 실시간 대응이 가능하도록 하세요.',
    ],
    actionPlans: atRiskKPIs.slice(0, 3).map((kpi, index) => ({
      id: `plan-default-${Date.now()}-${index}`,
      kpiId: kpi.id,
      title: `${kpi.name} 개선 계획`,
      description: `${kpi.name}의 현재 달성률이 ${((kpi.current / kpi.target) * 100).toFixed(1)}%로 목표 달성을 위해 추가적인 노력이 필요합니다.`,
      priority: kpi.status === 'behind' ? ('high' as const) : ('medium' as const),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending' as const,
    })),
  };
}

