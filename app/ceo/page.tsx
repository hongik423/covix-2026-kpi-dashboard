'use client';

import { useMemo } from 'react';
import { executives } from '../data/executives';
import { immediateTasks } from '../data/tasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Building2, Target, AlertTriangle, TrendingUp, CheckCircle2, Factory, FlaskConical } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CEODashboard() {
  // 2026년 목표: 200억원
  const totalRevenue = useMemo(() => ({ 
    target: 20000000000, // 200억원 (20,000,000,000)
    current: 17000000000, // 현재 170억원 (17,000,000,000) - 85% 달성
    unit: '원' 
  }), []);

  // 월별 데이터 생성 (2026년 1월~6월)
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
    // 월별 목표: 200억 / 12개월 = 월 16.67억
    // 월별 실적: 점진적 증가 추세 (1월 13억 → 6월 16억)
    const monthlyTarget = totalRevenue.target / 12; // 월 16.67억 (약 1,666,666,667원)
    const monthlyActuals = [
      1300000000, // 1월: 13억 (1,300,000,000)
      1350000000, // 2월: 13.5억 (1,350,000,000)
      1400000000, // 3월: 14억 (1,400,000,000)
      1450000000, // 4월: 14.5억 (1,450,000,000)
      1500000000, // 5월: 15억 (1,500,000,000)
      1600000000, // 6월: 16억 (1,600,000,000)
    ];
    
    return months.map((month, index) => ({
      month: format(new Date(month + '-01'), 'M월'),
      목표: Math.round(monthlyTarget / 100000000 * 10) / 10, // 억 단위, 소수점 1자리
      실적: monthlyActuals[index] / 100000000, // 억 단위
    }));
  }, [months, totalRevenue]);

  const totalProgress = (totalRevenue.current / totalRevenue.target) * 100;

  // 전사 핵심 지표 데이터
  const keyMetrics = useMemo(() => [
    {
      category: '연간 매출액',
      target: 200,
      current: 20,
      unit: '억원',
      achievementRate: (20 / 200) * 100,
      status: 'behind' as const,
    },
    {
      category: '영업이익률',
      target: 10,
      current: 3,
      unit: '%',
      achievementRate: (3 / 10) * 100,
      status: 'behind' as const,
    },
    {
      category: '설비 가동률',
      target: 60,
      current: 30,
      unit: '%',
      achievementRate: (30 / 60) * 100,
      status: 'at-risk' as const,
    },
    {
      category: '신제품 출시',
      target: 18,
      current: 9,
      unit: '종',
      achievementRate: (9 / 18) * 100,
      status: 'behind' as const,
    },
    {
      category: '고용 인원',
      target: 80,
      current: 73,
      unit: '명',
      achievementRate: (73 / 80) * 100,
      status: 'on-track' as const,
    },
  ], []);

  // 즉시 대응 필요 항목 (우선순위 높은 항목만)
  const urgentTasks = useMemo(() => {
    return immediateTasks
      .filter((task) => task.priority === 'high' && task.status !== 'completed')
      .slice(0, 5);
  }, []);

  // 부서별 KPI 달성률 히트맵 데이터
  const departmentHeatmap = useMemo(() => {
    const departments = ['영업본부', '생산본부', '품질본부', '연구소'];
    const deptData: Record<string, { kpis: number[]; overall: string }> = {};

    departments.forEach((dept) => {
      const deptExecutives = executives.filter((e) => 
        e.department?.includes(dept.replace('본부', '').replace('연구소', '연구소'))
      );
      
      if (deptExecutives.length > 0) {
        const allKPIs = deptExecutives.flatMap((e) => e.kpis);
        const kpiProgress = [
          allKPIs[0] ? (allKPIs[0].current / allKPIs[0].target) * 100 : 0,
          allKPIs[1] ? (allKPIs[1].current / allKPIs[1].target) * 100 : 0,
          allKPIs[2] ? (allKPIs[2].current / allKPIs[2].target) * 100 : 0,
        ];
        const avgProgress = kpiProgress.reduce((sum, p) => sum + p, 0) / kpiProgress.length;
        
        deptData[dept] = {
          kpis: kpiProgress,
          overall: avgProgress >= 70 ? 'B' : avgProgress >= 50 ? 'C' : 'D',
        };
      } else {
        deptData[dept] = {
          kpis: [0, 0, 0],
          overall: 'C',
        };
      }
    });

    return deptData;
  }, []);

  const getStatusColor = (status: 'on-track' | 'at-risk' | 'behind') => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 dark:text-green-400';
      case 'at-risk':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'behind':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusIcon = (status: 'on-track' | 'at-risk' | 'behind') => {
    switch (status) {
      case 'on-track':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'at-risk':
        return <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'behind':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'text-green-600 dark:text-green-400';
    if (progress >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-100 dark:bg-green-900/30';
    if (progress >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                코빅스 Vision 2026 전사 대시보드
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
                2026년 목표: 200억원 매출 달성 | CEO 성과관리 뷰
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">전사 매출 달성률</p>
              <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">전사 매출 목표</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div>
              <div className="flex flex-wrap items-baseline gap-2 mb-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {(totalRevenue.current / 100000000).toFixed(0)}억원
                </span>
                <span className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400">
                  / {(totalRevenue.target / 100000000).toFixed(0)}억원
                </span>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>2026년 목표 달성률</span>
                  <span className="font-semibold">{totalProgress.toFixed(1)}%</span>
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
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>• 연간 목표: 200억원</p>
                <p>• 현재 실적: 170억원 (누적)</p>
                <p>• 남은 목표: {(totalRevenue.target - totalRevenue.current) / 100000000}억원</p>
              </div>
            </div>
            <div className="min-h-[200px] sm:min-h-[250px]">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">본부별 KPI 달성률</h2>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px] min-h-[250px] sm:min-h-[300px]">
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
          </div>
        </div>

        {/* 전사 핵심 지표 및 즉시 대응 필요 항목 */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* 전사 핵심 지표 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              전사 핵심 지표
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm min-w-[500px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">구분</th>
                    <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">목표</th>
                    <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">현재</th>
                    <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">달성률</th>
                    <th className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {keyMetrics.map((metric, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-3 text-gray-900 dark:text-white font-medium">
                        {metric.category}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-600 dark:text-gray-300">
                        {metric.target.toLocaleString()}{metric.unit}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-900 dark:text-white font-semibold">
                        {metric.current.toLocaleString()}{metric.unit}
                      </td>
                      <td className={`py-3 px-3 text-right font-semibold ${getProgressColor(metric.achievementRate)}`}>
                        {metric.achievementRate.toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStatusIcon(metric.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 즉시 대응 필요 항목 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              즉시 대응 필요 항목
            </h3>
            <div className="space-y-3">
              {urgentTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{task.department}</span>
                      <span>•</span>
                      <span>{task.owner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 부서별 KPI 달성률 히트맵 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            부서별 KPI 달성률 히트맵
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                    부서
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                    KPI 1
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                    KPI 2
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                    KPI 3
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                    종합 평가
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(departmentHeatmap).map(([dept, data]) => (
                  <tr
                    key={dept}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {dept}
                    </td>
                    {data.kpis.map((kpi, idx) => (
                      <td
                        key={idx}
                        className={`py-3 px-4 text-center font-semibold ${
                          kpi >= 70
                            ? 'text-green-600 dark:text-green-400'
                            : kpi >= 50
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : kpi > 0
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {kpi.toFixed(0)}%
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          data.overall === 'A'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : data.overall === 'B'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : data.overall === 'C'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {data.overall}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 본부별 상세 현황 */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {executive.name} {executive.position}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      평균 달성률: {avgProgress.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${
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

