'use client';

import { useState } from 'react';
import { KPI } from '../types/kpi';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedbackForm } from './FeedbackForm';

interface KPICardExpandedProps {
  kpi: KPI;
  month: string;
  onFeedbackSave: (kpiId: string, feedback: Omit<import('../types/kpi').Feedback, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function KPICardExpanded({ kpi, month, onFeedbackSave }: KPICardExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = (kpi.current / kpi.target) * 100;
  const isPositive = percentage >= 90;
  const isWarning = percentage >= 70 && percentage < 90;

  const getStatusIcon = () => {
    switch (kpi.status) {
      case 'on-track':
        return <div className="w-4 h-4 rounded-full bg-green-500" />;
      case 'at-risk':
        return <div className="w-4 h-4 rounded-full bg-yellow-500" />;
      case 'behind':
        return <div className="w-4 h-4 rounded-full bg-red-500" />;
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

  const getStatusBorderColor = () => {
    if (isPositive) return 'border-green-500';
    if (isWarning) return 'border-yellow-500';
    return 'border-red-500';
  };

  const hasFeedback = kpi.feedback && (kpi.feedback.rootCause || kpi.feedback.actionPlan || kpi.feedback.evidenceFiles.length > 0);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 transition-all ${
      isExpanded 
        ? `${getStatusBorderColor()} shadow-lg` 
        : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
    }`}>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon()}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {kpi.name}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.category}</p>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
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
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getStatusColor()} transition-all duration-300`}
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
                ? '🟢 정상'
                : kpi.status === 'at-risk'
                  ? '🟡 주의'
                  : '🔴 위험'}
            </span>
          </div>
        </div>

        {hasFeedback && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              ✓ 피드백 및 행동계획이 작성되었습니다
            </p>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
          <FeedbackForm
            kpiId={kpi.id}
            month={month}
            initialFeedback={kpi.feedback}
            onSave={(feedback) => onFeedbackSave(kpi.id, feedback)}
          />
        </div>
      )}
    </div>
  );
}

