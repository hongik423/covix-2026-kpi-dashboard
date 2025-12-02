'use client';

import { useMemo } from 'react';
import { executives } from '../data/executives';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Building2, Target } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CEODashboard() {
  const totalRevenue = useMemo(() => ({ target: 200000000000, current: 174000000000, unit: '원' }), []); // 200억 목표

  // 월별 데이터 생성
  const months = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return format(date, 'yyyy-MM');
    });
  }, []);

  const chartData = useMemo(() => {
    return executives.map((exec) => {
      const avgProgress =
        exec.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) /
        exec.kpis.length;
      return {
        name: exec.name,
        달성률: avgProgress,
        목표: 100,
      };
    });
  }, []);

  const revenueData = useMemo(() => {
    // 고정된 랜덤 값 생성 (렌더링마다 변경되지 않도록)
    const randomValues = [0.87, 0.89, 0.91, 0.88, 0.90, 0.92];
    return months.map((month, index) => ({
      month: format(new Date(month + '-01'), 'M월'),
      목표: totalRevenue.target / 100000000,
      실적: Math.floor((totalRevenue.current / 100000000) * randomValues[index]),
    }));
  }, [months, totalRevenue]);

  const totalProgress = (totalRevenue.current / totalRevenue.target) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                코빅스 Vision 2026 전사 대시보드
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">CEO 성과관리 뷰</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">전사 매출 달성률</p>
              <p className={`text-4xl font-bold ${
                totalProgress >= 90 
                  ? 'text-green-600 dark:text-green-400' 
                  : totalProgress >= 70 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {totalProgress.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* 전사 매출 목표 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">전사 매출 목표</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {(totalRevenue.current / 100000000).toFixed(0)}억
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400">
                  / {(totalRevenue.target / 100000000).toFixed(0)}억원
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-300 ${
                    totalProgress >= 90 
                      ? 'bg-green-500' 
                      : totalProgress >= 70 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(totalProgress, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => [`${value}억원`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="목표" fill="#3b82f6" />
                  <Bar dataKey="실적" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 본부별 KPI 현황 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">본부별 KPI 달성률</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, '달성률']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="목표" fill="#e5e7eb" />
              <Bar dataKey="달성률">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.달성률 >= 90
                        ? '#10b981'
                        : entry.달성률 >= 70
                          ? '#f59e0b'
                          : '#ef4444'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 본부별 상세 현황 */}
        <div className="grid md:grid-cols-2 gap-6">
          {executives.map((executive) => {
            const avgProgress =
              executive.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) /
              executive.kpis.length;
            const onTrackCount = executive.kpis.filter((kpi) => kpi.status === 'on-track').length;
            const atRiskCount = executive.kpis.filter((kpi) => kpi.status === 'at-risk').length;
            const behindCount = executive.kpis.filter((kpi) => kpi.status === 'behind').length;

            return (
              <Link
                key={executive.id}
                href={`/dashboard/${executive.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {executive.name} {executive.position}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      평균 달성률: {avgProgress.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${
                    avgProgress >= 90 
                      ? 'text-green-600 dark:text-green-400' 
                      : avgProgress >= 70 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {avgProgress >= 90 ? '🟢' : avgProgress >= 70 ? '🟡' : '🔴'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">전체 KPI</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {executive.kpis.length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">🟢 정상</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {onTrackCount}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-600 dark:text-yellow-400">🟡 주의</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {atRiskCount}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">🔴 위험</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {behindCount}개
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      상세 대시보드 보기
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

