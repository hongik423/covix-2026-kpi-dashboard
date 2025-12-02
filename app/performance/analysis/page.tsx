'use client';

import { useState, useEffect } from 'react';
import { analyzePerformanceFiles } from '../../lib/ai-analysis';
import { Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface AnalysisResult {
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

export default function PerformanceAnalysisPage() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);

  useEffect(() => {
    // 해당 월의 업로드된 파일 확인
    const storageKey = `performance-files-${selectedMonth}`;
    const files = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setHasFiles(files.length > 0);
    setAnalysis(null);
  }, [selectedMonth]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const storageKey = `performance-files-${selectedMonth}`;
      const files = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const result = await analyzePerformanceFiles(files, selectedMonth);
      setAnalysis(result);
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              AI 성과 분석 및 피드백
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              업로드된 성과자료를 AI가 분석하여 인사이트와 개선 방안을 제시합니다
            </p>
          </div>

          {/* 월별 선택 및 분석 버튼 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  분석 대상 월
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (11 - i));
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
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !hasFiles}
                className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>AI 분석 시작</span>
                  </>
                )}
              </button>
            </div>

            {!hasFiles && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ 해당 월에 업로드된 파일이 없습니다. 먼저 성과자료를 업로드해주세요.
                </p>
              </div>
            )}
          </div>

          {/* 분석 결과 */}
          {isAnalyzing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                AI가 성과자료를 분석하고 있습니다...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                잠시만 기다려주세요
              </p>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              {/* 요약 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    분석 요약
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* 강점 */}
              {analysis.strengths.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      주요 강점
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-green-600 dark:text-green-400 font-bold mt-1">
                          ✓
                        </span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 개선점 */}
              {analysis.weaknesses.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      개선 필요 영역
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-1">
                          ⚠
                        </span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 권장사항 */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      개선 권장사항
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                          →
                        </span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 행동 계획 */}
              {analysis.actionPlans.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      향후 개선 행동 계획
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.actionPlans.map((plan, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          plan.priority === 'high'
                            ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                            : plan.priority === 'medium'
                              ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {plan.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              plan.priority === 'high'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : plan.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {plan.priority === 'high' ? '높음' : plan.priority === 'medium' ? '보통' : '낮음'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {plan.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          마감일: {plan.deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

