'use client';

import Link from 'next/link';
import { executives } from '../data/executives';
import { BarChart3, Users, TrendingUp, Building2, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            코빅스 통합 대시보드
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            2026년 200억 매출 달성을 위한 성과관리 시스템
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

        {/* 빠른 링크 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/ceo"
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Building2 className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">전사 대시보드</h3>
            <p className="text-sm text-blue-100">CEO 뷰</p>
            <ArrowRight className="w-5 h-5 mt-2" />
          </Link>

          <Link
            href="/performance/upload"
            className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">KPI 등록</h3>
            <p className="text-sm text-purple-100">성과자료 업로드</p>
            <ArrowRight className="w-5 h-5 mt-2" />
          </Link>

          <Link
            href="/performance/analysis"
            className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">AI 분석</h3>
            <p className="text-sm text-green-100">성과 분석</p>
            <ArrowRight className="w-5 h-5 mt-2" />
          </Link>

          <Link
            href="/"
            className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Users className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">개인 대시보드</h3>
            <p className="text-sm text-gray-100">담당자별 KPI</p>
            <ArrowRight className="w-5 h-5 mt-2" />
          </Link>
        </div>

        {/* 본부별 대시보드 링크 */}
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {executive.name}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      {executive.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {avgProgress.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">평균 달성률</p>
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

