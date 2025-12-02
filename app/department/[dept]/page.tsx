'use client';

import { useParams } from 'next/navigation';
import { executives } from '../../data/executives';
import { KPICardExpanded } from '../../components/KPICardExpanded';
import { KPITrendChart } from '../../components/KPITrendChart';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { updateKPIWithFeedback } from '../../lib/storage';
import { KPI } from '../../types/kpi';
import { Building2, Factory, FlaskConical } from 'lucide-react';

const departmentMap: Record<string, { name: string; icon: any }> = {
  sales: { name: '영업본부', icon: Building2 },
  production: { name: '생산본부', icon: Factory },
  quality: { name: '품질본부+연구소', icon: FlaskConical },
};

export default function DepartmentPage() {
  const params = useParams();
  const deptId = params.dept as string;
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [kpis, setKpis] = useState<KPI[]>([]);

  const department = departmentMap[deptId];
  const deptExecutives = executives.filter((e) => e.department === department?.name);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!department) return;

    try {
      const allKPIs: KPI[] = [];
      deptExecutives.forEach((exec) => {
        exec.kpis.forEach((kpi) => {
          const updatedKpi = updateKPIWithFeedback(kpi, selectedMonth);
          allKPIs.push(updatedKpi);
        });
      });
      setKpis(allKPIs);
    } catch (error) {
      console.error('KPI 로드 오류:', error);
      setKpis([]);
    }
  }, [deptId, selectedMonth, department]);

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">부서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const Icon = department.icon;
  const avgProgress =
    kpis.length > 0
      ? kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / kpis.length
      : 0;

  const handleFeedbackSave = (kpiId: string, feedback: any) => {
    // 피드백 저장 로직
    if (typeof window !== 'undefined') {
      try {
        const { saveFeedback } = require('../../lib/storage');
        saveFeedback(kpiId, selectedMonth, feedback);
        // KPI 목록 업데이트
        setKpis((prevKPIs) =>
          prevKPIs.map((kpi) =>
            kpi.id === kpiId
              ? {
                  ...kpi,
                  feedback: {
                    ...feedback,
                    id: `${kpiId}-${selectedMonth}-${Date.now()}`,
                    kpiId,
                    month: selectedMonth,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    evidenceFiles: feedback.evidenceFiles || [],
                  },
                }
              : kpi,
          ),
        );
      } catch (error) {
        console.error('피드백 저장 오류:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {department.name} 대시보드
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {deptExecutives.map((e) => e.name).join(', ')} 담당
              </p>
            </div>
          </div>

          {/* 월별 선택 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 mb-6">
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              조회 월
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* 통계 */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">담당자 수</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deptExecutives.length}명
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">전체 KPI</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.length}개</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">평균 달성률</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {avgProgress.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">정상 진행</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {kpis.filter((kpi) => kpi.status === 'on-track').length}개
              </p>
            </div>
          </div>
        </div>

        {/* KPI 카드 */}
        <div className="space-y-4 mb-8">
          {kpis.map((kpi) => (
            <KPICardExpanded
              key={kpi.id}
              kpi={kpi}
              month={selectedMonth}
              onFeedbackSave={handleFeedbackSave}
            />
          ))}
        </div>

        {/* 차트 */}
        {kpis.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {kpis.slice(0, 2).map((kpi) => (
              <KPITrendChart key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

