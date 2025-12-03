'use client';

import Link from 'next/link';
import { executives } from './data/executives';
import { BarChart3, Users, TrendingUp, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            코빅스 KPI 성과관리 대시보드
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-2">
            임원별 KPI를 실시간으로 모니터링하고 분석합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">임원 수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {executives.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">전체 KPI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {executives.reduce((sum, exec) => sum + exec.kpis.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">평균 달성률</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(
                    executives.reduce((sum, exec) => {
                      const avg =
                        exec.kpis.reduce(
                          (kpiSum, kpi) => kpiSum + (kpi.current / kpi.target) * 100,
                          0,
                        ) / exec.kpis.length;
                      return sum + avg;
                    }, 0) / executives.length
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CEO 대시보드 링크 */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/ceo"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">전사 대시보드 (CEO 뷰)</h2>
              <p className="text-sm sm:text-base text-blue-100">전사 매출 목표 및 본부별 KPI 현황을 한눈에 확인하세요</p>
            </div>
            <span className="text-xl sm:text-2xl flex-shrink-0">→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {executives.map((executive) => {
            const avgProgress =
              executive.kpis.reduce(
                (sum, kpi) => sum + (kpi.current / kpi.target) * 100,
                0,
              ) / executive.kpis.length;
            const onTrackCount = executive.kpis.filter((kpi) => kpi.status === 'on-track')
              .length;

            return (
              <Link
                key={executive.id}
                href={`/dashboard/${executive.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {executive.name}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                      {executive.position}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {avgProgress.toFixed(1)}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">평균 달성률</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">전체 KPI</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {executive.kpis.length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">정상 진행</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {onTrackCount}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">주의 필요</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {executive.kpis.filter((kpi) => kpi.status === 'at-risk').length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">위험</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {executive.kpis.filter((kpi) => kpi.status === 'behind').length}개
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      대시보드 보기
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
