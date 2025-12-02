'use client';

import { KPI } from '../types/kpi';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const percentage = (kpi.current / kpi.target) * 100;
  const isPositive = percentage >= 90;
  const isWarning = percentage >= 70 && percentage < 90;

  const getStatusIcon = () => {
    switch (kpi.status) {
      case 'on-track':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'behind':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    if (isPositive) return 'bg-green-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {kpi.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.category}</p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          {getStatusIcon()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {kpi.current.toLocaleString()}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400">
            / {kpi.target.toLocaleString()} {kpi.unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor()} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            달성률: {percentage.toFixed(1)}%
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : isWarning
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
            }`}
          >
            {kpi.status === 'on-track'
              ? '정상'
              : kpi.status === 'at-risk'
                ? '주의'
                : '위험'}
          </span>
        </div>
      </div>
    </div>
  );
}

