'use client';

import { useState } from 'react';
import { immediateTasks } from '../data/tasks';
import { Task } from '../types/kpi';
import { CheckCircle2, Clock, AlertCircle, XCircle, Filter, Calendar, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TasksPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const departments = Array.from(new Set(immediateTasks.map((t) => t.department)));

  const filteredTasks = immediateTasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const deptMatch = filterDepartment === 'all' || task.department === filterDepartment;
    return statusMatch && deptMatch;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in-progress':
        return '진행중';
      case 'delayed':
        return '지연';
      case 'pending':
        return '대기';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
    }
  };

  const stats = {
    total: immediateTasks.length,
    completed: immediateTasks.filter((t) => t.status === 'completed').length,
    inProgress: immediateTasks.filter((t) => t.status === 'in-progress').length,
    delayed: immediateTasks.filter((t) => t.status === 'delayed').length,
    pending: immediateTasks.filter((t) => t.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            즉시실행 과제 추적
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            전사 즉시실행 과제 관리 및 진척률 추적
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">전체 과제</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}건</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">완료</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}건
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">진행중</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.inProgress}건
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">지연</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.delayed}건</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">대기</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {stats.pending}건
            </p>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">필터</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                상태
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">전체</option>
                <option value="pending">대기</option>
                <option value="in-progress">진행중</option>
                <option value="completed">완료</option>
                <option value="delayed">지연</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                부서
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">전체</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 과제 목록 */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{task.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(task.startDate), 'yyyy-MM-dd')} ~{' '}
                          {format(new Date(task.endDate), 'yyyy-MM-dd')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
                  >
                    우선순위: {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    진척률
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      task.progress >= 100
                        ? 'bg-green-500'
                        : task.progress >= 50
                          ? 'bg-blue-500'
                          : task.progress > 0
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(task.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              선택한 조건에 맞는 과제가 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

