/**
 * @fileoverview 즉시실행 과제 데이터
 * @encoding UTF-8
 */

import { Task } from '../types/kpi';

export const immediateTasks: Task[] = [
  {
    id: 'task-1',
    title: 'CRM 시스템 구축',
    department: '영업본부',
    owner: '오효성',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    progress: 0,
    status: 'pending',
    priority: 'high',
    description: '혁신위우시 활용',
  },
  {
    id: 'task-2',
    title: '생산·전력 10명 배용',
    department: '생산본부',
    owner: '최홍영',
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    progress: 0,
    status: 'pending',
    priority: 'high',
    description: '2.0개 간수제 도입',
  },
  {
    id: 'task-3',
    title: 'ISO 22716 인증 준비',
    department: '품질본부',
    owner: '최준영',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    progress: 0,
    status: 'pending',
    priority: 'medium',
    description: '1.0MP 인증',
  },
  {
    id: 'task-4',
    title: '신규 고객 5개사 확보',
    department: '영업본부',
    owner: '차귀훈',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    progress: 0,
    status: 'pending',
    priority: 'high',
    description: 'Q1 목표',
  },
  {
    id: 'task-5',
    title: '설비 가동률 40% 달성',
    department: '생산본부',
    owner: '최홍영',
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    progress: 30,
    status: 'in-progress',
    priority: 'high',
    description: '현재 30%',
  },
  {
    id: 'task-6',
    title: '정부 지원금 1억 원 확보',
    department: '경영관리',
    owner: '신영민',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    progress: 10,
    status: 'in-progress',
    priority: 'medium',
    description: '제조혁신비우처',
  },
  {
    id: 'task-7',
    title: '신제품 6종 개발',
    department: '연구소',
    owner: '이창훈',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    progress: 0,
    status: 'pending',
    priority: 'high',
    description: '57번기 목표',
  },
  {
    id: 'task-8',
    title: '주요 거래처 매출 20% 확대',
    department: '영업본부',
    owner: '차귀훈',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    progress: 0,
    status: 'pending',
    priority: 'medium',
    description: '110PS 고부',
  },
  {
    id: 'task-9',
    title: '생산 리드타임 30% 단축',
    department: '생산본부',
    owner: '최홍영',
    startDate: '2026-01-15',
    endDate: '2026-04-30',
    progress: 0,
    status: 'pending',
    priority: 'high',
    description: '24일~21일',
  },
];

export function getTasksByDepartment(department: string): Task[] {
  return immediateTasks.filter((task) => task.department === department);
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return immediateTasks.filter((task) => task.status === status);
}


