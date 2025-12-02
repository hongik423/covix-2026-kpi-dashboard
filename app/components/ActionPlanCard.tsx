'use client';

import { ActionPlan } from '../types/kpi';
import { Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface ActionPlanCardProps {
  plan: ActionPlan;
}

export function ActionPlanCard({ plan }: ActionPlanCardProps) {
  const getPriorityColor = () => {
    switch (plan.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusColor = () => {
    switch (plan.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityLabel = () => {
    switch (plan.priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
    }
  };

  const getStatusLabel = () => {
    switch (plan.status) {
      case 'completed':
        return '완료';
      case 'in-progress':
        return '진행중';
      case 'pending':
        return '대기';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {plan.title}
        </h3>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor()}`}
          >
            <Flag className="w-3 h-3 inline mr-1" />
            {getPriorityLabel()}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Calendar className="w-4 h-4 mr-2" />
        <span>
          마감일: {format(new Date(plan.dueDate), 'yyyy년 MM월 dd일')}
        </span>
      </div>
    </div>
  );
}

