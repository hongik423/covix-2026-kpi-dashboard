'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getExecutiveById } from '../../data/executives';
import { Executive, AnalysisResult, KPI } from '../../types/kpi';
import { KPICardExpanded } from '../../components/KPICardExpanded';
import { KPITrendChart } from '../../components/KPITrendChart';
import { ActionPlanCard } from '../../components/ActionPlanCard';
import { analyzeKPI } from '../../lib/gemini';
import { saveFeedback, updateKPIWithFeedback } from '../../lib/storage';
import { ArrowLeft, Loader2, Sparkles, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const executiveId = params.executive as string;

  const [executive, setExecutive] = useState<Executive | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    const exec = getExecutiveById(executiveId);
    if (!exec) {
      router.push('/');
      return;
    }
    setExecutive(exec);
    
    // 피드백 데이터와 함께 KPI 업데이트
    const updatedKpis = exec.kpis.map((kpi) => updateKPIWithFeedback(kpi, selectedMonth));
    setKpis(updatedKpis);
    
    setLoading(false);

    // AI 분석 실행
    setAnalyzing(true);
    analyzeKPI(exec)
      .then((result) => {
        setAnalysis(result);
        setAnalyzing(false);
      })
      .catch((error) => {
        console.error('분석 오류:', error);
        setAnalyzing(false);
      });
  }, [executiveId, router, selectedMonth]);

  const handleFeedbackSave = (kpiId: string, feedback: Omit<import('../../types/kpi').Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    saveFeedback(kpiId, selectedMonth, feedback);
    
    // KPI 목록 업데이트
    const updatedKpis = kpis.map((kpi) => {
      if (kpi.id === kpiId) {
        return updateKPIWithFeedback(kpi, selectedMonth);
      }
      return kpi;
    });
    setKpis(updatedKpis);
    
    // Executive 객체도 업데이트
    if (executive) {
      setExecutive({
        ...executive,
        kpis: updatedKpis,
      });
    }
  };

  if (loading || !executive) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const avgProgress =
    executive.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) /
    executive.kpis.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </button>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {executive.name} {executive.position}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                GEMS 기반 KPI 성과관리 대시보드
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">전체 평균 달성률</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {avgProgress.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* 월별 선택 */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <label htmlFor="month-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              조회 월:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (5 - i));
                const monthValue = format(date, 'yyyy-MM');
                const monthLabel = format(date, 'yyyy년 MM월');
                return (
                  <option key={monthValue} value={monthValue}>
                    {monthLabel}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* KPI 카드 그리드 - 확장 가능한 카드 */}
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>사용 방법:</strong> 각 KPI 카드를 클릭하면 실적 증빙 파일 첨부, 원인 분석, 행동 계획을 작성할 수 있습니다.
            </p>
          </div>
          {kpis.map((kpi) => (
            <KPICardExpanded
              key={kpi.id}
              kpi={kpi}
              month={selectedMonth}
              onFeedbackSave={handleFeedbackSave}
            />
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {kpis.slice(0, 2).map((kpi) => (
            <KPITrendChart key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* AI 분석 섹션 */}
        {analyzing ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-700 dark:text-gray-300">
                AI 분석 중...
              </span>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-8 mb-8">
            {/* 분석 요약 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI 분석 요약</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* 인사이트 */}
            {analysis.insights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  주요 인사이트
                </h2>
                <ul className="space-y-3">
                  {analysis.insights.map((insight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                        •
                      </span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 권장사항 */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  권장사항
                </h2>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-600 dark:text-green-400 font-bold mt-1">
                        ✓
                      </span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 실행 계획 */}
            {analysis.actionPlans.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  실행 계획
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.actionPlans.map((plan) => (
                    <ActionPlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

