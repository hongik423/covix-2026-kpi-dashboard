'use client';

import Link from 'next/link';
import { executives } from '../data/executives';
import { immediateTasks } from '../data/tasks';
import {
  Target,
  Building2,
  Factory,
  FlaskConical,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function OverviewPage() {
  const totalRevenue = { target: 200000000000, current: 174000000000 }; // 200억 목표
  const salesRevenue = 172000000000; // 영업본부 목표

  const departments = {
    sales: executives.filter((e) => e.department === '영업본부'),
    production: executives.filter((e) => e.department === '생산본부'),
    quality: executives.filter((e) => e.department === '품질본부+연구소'),
  };

  const taskStats = {
    total: immediateTasks.length,
    completed: immediateTasks.filter((t) => t.status === 'completed').length,
    inProgress: immediateTasks.filter((t) => t.status === 'in-progress').length,
    pending: immediateTasks.filter((t) => t.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold">C</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">코빅스 통합 대시보드</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">200억 매출 달성 실시간 모니터링 시스템</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 rounded-full text-xs sm:text-sm font-medium">
              2026년 목표: 200억원
            </div>
          </div>
        </div>

        {/* 상단 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Target className="w-5 h-5 sm:w-8 sm:h-8 flex-shrink-0" />
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">전사 목표</h2>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">200억원</p>
            <p className="text-xs sm:text-sm text-blue-100">2026년 매출 목표</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Building2 className="w-5 h-5 sm:w-8 sm:h-8 flex-shrink-0" />
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">영업본부</h2>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">172억원</p>
            <p className="text-xs sm:text-sm text-green-100">영업본부 목표</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Factory className="w-5 h-5 sm:w-8 sm:h-8 flex-shrink-0" />
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">생산본부</h2>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">최홍영</p>
            <p className="text-xs sm:text-sm text-pink-100">생산본부장</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <FlaskConical className="w-5 h-5 sm:w-8 sm:h-8 flex-shrink-0" />
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">품질+연구</h2>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">최준영</p>
            <p className="text-xs sm:text-sm text-red-100">품질본부장/연구소장</p>
          </div>
        </div>

        {/* 상세 카드 섹션 */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* 전사 실시간 대시보드 */}
          <Link
            href="/ceo"
            className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 hover:border-blue-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">전사 실시간 대시보드</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              200억 달성 실시간 모니터링 및 핵심 지표 확인
            </p>
          </Link>

          {/* 영업본부 대시보드 */}
          <Link
            href="/department/sales"
            className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 hover:border-green-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-400 transition-colors flex-shrink-0" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">영업본부 대시보드</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              차귀훈 본부장 & 오효성 이사 개인별 성과 관리
            </p>
          </Link>

          {/* 즉시실행 과제 */}
          <Link
            href="/tasks"
            className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-400 transition-colors flex-shrink-0" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">즉시실행 과제 추적</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              전사 즉시실행 과제 관리 및 진척률 추적
            </p>
          </Link>
        </div>

        {/* 하단 섹션 */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* 생산본부 KPI */}
          <Link
            href="/department/production"
            className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 hover:border-pink-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Factory className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-pink-400 transition-colors flex-shrink-0" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">생산본부 KPI</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">최홍영 생산본부장</p>
            <p className="text-xs sm:text-sm text-gray-500">
              생산 효율, 설비 가동률, 일일 생산 추이 모니터링
            </p>
          </Link>

          {/* 품질본부 + 연구소 KPI */}
          <Link
            href="/department/quality"
            className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 hover:border-red-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-400 transition-colors flex-shrink-0" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">품질본부 + 연구소 KPI</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">최준영, 이창훈</p>
            <p className="text-xs sm:text-sm text-gray-500">
              품질 관리, 신제품 개발 현황, 연구 성과 추적
            </p>
          </Link>
        </div>

        {/* 전체 현황 요약 */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold">전체 현황 요약</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold mb-1">6개</p>
              <p className="text-xs sm:text-sm text-blue-100">대시보드 섹션</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold mb-1">200억원</p>
              <p className="text-xs sm:text-sm text-blue-100">연간 목표 매출</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold mb-1">실시간</p>
              <p className="text-xs sm:text-sm text-blue-100">데이터 업데이트</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


