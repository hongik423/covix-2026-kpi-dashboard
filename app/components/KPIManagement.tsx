'use client';

import { useState, useEffect } from 'react';
import { KPI } from '../types/kpi';
import { executives } from '../data/executives';
import { Plus, Trash2, Edit2, Save, X, Target, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface KPIManagementProps {
  selectedMonth: string;
}

interface MonthlyKPITarget {
  kpiId: string;
  executiveId: string;
  month: string;
  target: number;
}

export function KPIManagement({ selectedMonth }: KPIManagementProps) {
  const [selectedExecutive, setSelectedExecutive] = useState<string>('');
  const [isAddingKPI, setIsAddingKPI] = useState(false);
  const [editingKPIId, setEditingKPIId] = useState<string | null>(null);
  const [monthlyTargets, setMonthlyTargets] = useState<Record<string, MonthlyKPITarget>>({});
  const [customKPIs, setCustomKPIs] = useState<Record<string, KPI[]>>({});

  // 새 KPI 입력 필드
  const [newKPI, setNewKPI] = useState({
    name: '',
    category: '',
    unit: '',
    period: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    target: 0,
  });

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 커스텀 KPI 로드
      const storedKPIs = localStorage.getItem('custom-kpis');
      if (storedKPIs) {
        requestAnimationFrame(() => {
          setCustomKPIs(JSON.parse(storedKPIs));
        });
      }

      // 월별 목표 로드
      const storedTargets = localStorage.getItem(`monthly-targets-${selectedMonth}`);
      if (storedTargets) {
        const targets = JSON.parse(storedTargets);
        const targetsMap: Record<string, MonthlyKPITarget> = {};
        targets.forEach((target: MonthlyKPITarget) => {
          targetsMap[`${target.executiveId}-${target.kpiId}`] = target;
        });
        requestAnimationFrame(() => {
          setMonthlyTargets(targetsMap);
        });
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    }
  }, [selectedMonth]);

  // 선택된 담당자의 KPI 목록 가져오기
  const getKPIsForExecutive = (executiveId: string): KPI[] => {
    const executive = executives.find((e) => e.id === executiveId);
    const baseKPIs = executive ? [...executive.kpis] : [];
    const custom = customKPIs[executiveId] || [];
    return [...baseKPIs, ...custom];
  };

  // KPI 추가
  const handleAddKPI = () => {
    if (!selectedExecutive || !newKPI.name || !newKPI.category) {
      alert('담당자를 선택하고 KPI 이름과 카테고리를 입력해주세요.');
      return;
    }

    const kpi: KPI = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newKPI.name,
      target: newKPI.target,
      current: 0,
      unit: newKPI.unit || '',
      trend: 'stable',
      status: 'on-track',
      category: newKPI.category,
      period: newKPI.period,
    };

    const updated = {
      ...customKPIs,
      [selectedExecutive]: [...(customKPIs[selectedExecutive] || []), kpi],
    };

    setCustomKPIs(updated);
    localStorage.setItem('custom-kpis', JSON.stringify(updated));

    // 초기화
    setNewKPI({
      name: '',
      category: '',
      unit: '',
      period: 'monthly',
      target: 0,
    });
    setIsAddingKPI(false);
  };

  // KPI 삭제
  const handleDeleteKPI = (executiveId: string, kpiId: string) => {
    if (!confirm('이 KPI를 삭제하시겠습니까?')) return;

    const updated = {
      ...customKPIs,
      [executiveId]: (customKPIs[executiveId] || []).filter((kpi) => kpi.id !== kpiId),
    };

    setCustomKPIs(updated);
    localStorage.setItem('custom-kpis', JSON.stringify(updated));

    // 월별 목표도 삭제
    const targetKey = `${executiveId}-${kpiId}`;
    if (monthlyTargets[targetKey]) {
      const updatedTargets = { ...monthlyTargets };
      delete updatedTargets[targetKey];
      setMonthlyTargets(updatedTargets);
      saveMonthlyTargets(updatedTargets);
    }
  };

  // 월별 목표 저장
  const saveMonthlyTargets = (targets: Record<string, MonthlyKPITarget>) => {
    if (typeof window === 'undefined') return;

    const targetsArray = Object.values(targets).filter((t) => t.month === selectedMonth);
    localStorage.setItem(`monthly-targets-${selectedMonth}`, JSON.stringify(targetsArray));
  };

  // 월별 목표 업데이트
  const handleTargetChange = (executiveId: string, kpiId: string, target: number) => {
    const targetKey = `${executiveId}-${kpiId}`;
    const updated = {
      ...monthlyTargets,
      [targetKey]: {
        kpiId,
        executiveId,
        month: selectedMonth,
        target,
      },
    };
    setMonthlyTargets(updated);
    saveMonthlyTargets(updated);
  };

  const getTargetForKPI = (executiveId: string, kpiId: string): number => {
    const targetKey = `${executiveId}-${kpiId}`;
    return monthlyTargets[targetKey]?.target ?? 0;
  };

  return (
    <div className="space-y-6">
      {/* 담당자 선택 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">담당자 선택</h2>
        </div>
        <select
          value={selectedExecutive}
          onChange={(e) => {
            setSelectedExecutive(e.target.value);
            setIsAddingKPI(false);
            setEditingKPIId(null);
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">담당자를 선택하세요</option>
          {executives.map((exec) => (
            <option key={exec.id} value={exec.id}>
              {exec.name} ({exec.position})
            </option>
          ))}
        </select>
      </div>

      {/* KPI 목록 및 관리 */}
      {selectedExecutive && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {executives.find((e) => e.id === selectedExecutive)?.name}의 KPI 목록
              </h2>
            </div>
            <button
              onClick={() => {
                setIsAddingKPI(true);
                setEditingKPIId(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>KPI 추가</span>
            </button>
          </div>

          {/* KPI 추가 폼 */}
          {isAddingKPI && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                새 KPI 등록
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    KPI 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newKPI.name}
                    onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="예: 매출 목표 달성률"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newKPI.category}
                    onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="예: 매출, 영업, 서비스"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    단위
                  </label>
                  <input
                    type="text"
                    value={newKPI.unit}
                    onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="예: %, 건, 점, 원"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    주기
                  </label>
                  <select
                    value={newKPI.period}
                    onChange={(e) =>
                      setNewKPI({ ...newKPI, period: e.target.value as 'monthly' | 'quarterly' | 'yearly' })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="monthly">월별</option>
                    <option value="quarterly">분기별</option>
                    <option value="yearly">연간</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    기본 목표값
                  </label>
                  <input
                    type="number"
                    value={newKPI.target || ''}
                    onChange={(e) => setNewKPI({ ...newKPI, target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddKPI}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddingKPI(false);
                    setNewKPI({
                      name: '',
                      category: '',
                      unit: '',
                      period: 'monthly',
                      target: 0,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </button>
              </div>
            </div>
          )}

          {/* KPI 목록 */}
          <div className="space-y-4">
            {getKPIsForExecutive(selectedExecutive).map((kpi) => {
              const isCustom = (customKPIs[selectedExecutive] || []).some((ck) => ck.id === kpi.id);
              const targetValue = getTargetForKPI(selectedExecutive, kpi.id) || kpi.target;
              const isEditing = editingKPIId === kpi.id;

              return (
                <div
                  key={kpi.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{kpi.name}</h3>
                        {isCustom && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                            커스텀
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {kpi.category} • {kpi.period === 'monthly' ? '월별' : kpi.period === 'quarterly' ? '분기별' : '연간'}
                      </p>
                    </div>
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteKPI(selectedExecutive, kpi.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="KPI 삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* 월별 목표 입력 */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(selectedMonth + '-01'), 'yyyy년 MM월')} 목표:
                      </span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={targetValue || ''}
                          onChange={(e) =>
                            handleTargetChange(selectedExecutive, kpi.id, parseFloat(e.target.value) || 0)
                          }
                          onBlur={() => setEditingKPIId(null)}
                          className="w-32 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => setEditingKPIId(kpi.id)}
                        >
                          {targetValue.toLocaleString()} {kpi.unit}
                        </span>
                      )}
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setEditingKPIId(kpi.id)}
                        className="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label="목표 수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {getKPIsForExecutive(selectedExecutive).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              등록된 KPI가 없습니다. KPI를 추가해주세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

