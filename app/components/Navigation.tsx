'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Building2, Upload, LayoutDashboard, Factory, FlaskConical, CheckSquare, Target } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/overview', label: '전체 개요', icon: Target },
    { href: '/ceo', label: '전사 대시보드', icon: Building2 },
    { href: '/department/sales', label: '영업본부', icon: Building2 },
    { href: '/department/production', label: '생산본부', icon: Factory },
    { href: '/department/quality', label: '품질+연구소', icon: FlaskConical },
    { href: '/tasks', label: '즉시실행', icon: CheckSquare },
    { href: '/performance/upload', label: 'KPI등록', icon: Upload },
    { href: '/performance/analysis', label: 'AI 분석', icon: BarChart3 },
    { href: '/dashboard', label: '통합 대시보드', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              COVIX 2026
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden xl:flex items-center gap-0.5 flex-wrap max-w-4xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-normal ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm leading-tight">{item.label}</span>
                </Link>
              );
            })}
            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* 태블릿/작은 데스크톱 네비게이션 (lg ~ xl) */}
          <div className="hidden lg:flex xl:hidden items-center gap-0.5 overflow-x-auto max-w-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              // 짧은 라벨 사용
              const shortLabel = item.label.length > 6 ? item.label.substring(0, 5) + '...' : item.label;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-colors whitespace-nowrap text-xs flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs">{shortLabel}</span>
                </Link>
              );
            })}
            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* 중간 태블릿 네비게이션 (md ~ lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-0.5 overflow-x-auto max-w-2xl">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-0.5 px-1.5 py-2 rounded-lg transition-colors whitespace-nowrap text-xs flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs">{item.label.length > 4 ? item.label.substring(0, 3) + '...' : item.label}</span>
                </Link>
              );
            })}
            <div className="ml-1 pl-1 border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* 모바일: 테마 토글 및 메뉴 버튼 */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="메뉴"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

