/**
 * @fileoverview 임원별 KPI 샘플 데이터
 * @encoding UTF-8
 */

import { Executive } from '../types/kpi';

export const executives: Executive[] = [
  {
    id: 'cha-gwi-hun',
    name: '차귀훈',
    position: '본부장',
    kpis: [
      {
        id: 'kpi-1',
        name: '매출 목표 달성률',
        target: 100,
        current: 87,
        unit: '%',
        trend: 'up',
        status: 'on-track',
        category: '매출',
        period: 'monthly',
      },
      {
        id: 'kpi-2',
        name: '신규 고객 확보',
        target: 50,
        current: 42,
        unit: '건',
        trend: 'up',
        status: 'on-track',
        category: '영업',
        period: 'monthly',
      },
      {
        id: 'kpi-3',
        name: '고객 만족도',
        target: 90,
        current: 85,
        unit: '점',
        trend: 'stable',
        status: 'at-risk',
        category: '서비스',
        period: 'monthly',
      },
      {
        id: 'kpi-4',
        name: '프로젝트 완료율',
        target: 95,
        current: 78,
        unit: '%',
        trend: 'down',
        status: 'behind',
        category: '운영',
        period: 'monthly',
      },
      {
        id: 'kpi-5',
        name: '팀 생산성',
        target: 120,
        current: 115,
        unit: '%',
        trend: 'up',
        status: 'on-track',
        category: '인사',
        period: 'monthly',
      },
    ],
  },
  {
    id: 'oh-hyo-sung',
    name: '오효성',
    position: '이사',
    kpis: [
      {
        id: 'kpi-6',
        name: '매출 목표 달성률',
        target: 100,
        current: 92,
        unit: '%',
        trend: 'up',
        status: 'on-track',
        category: '매출',
        period: 'monthly',
      },
      {
        id: 'kpi-7',
        name: '신규 파트너십',
        target: 20,
        current: 18,
        unit: '건',
        trend: 'up',
        status: 'on-track',
        category: '영업',
        period: 'monthly',
      },
      {
        id: 'kpi-8',
        name: '시장 점유율',
        target: 25,
        current: 22,
        unit: '%',
        trend: 'up',
        status: 'at-risk',
        category: '마케팅',
        period: 'quarterly',
      },
      {
        id: 'kpi-9',
        name: '브랜드 인지도',
        target: 80,
        current: 75,
        unit: '점',
        trend: 'stable',
        status: 'at-risk',
        category: '마케팅',
        period: 'quarterly',
      },
      {
        id: 'kpi-10',
        name: '고객 유지율',
        target: 95,
        current: 91,
        unit: '%',
        trend: 'down',
        status: 'at-risk',
        category: '고객관리',
        period: 'monthly',
      },
    ],
  },
];

export function getExecutiveById(id: string): Executive | undefined {
  return executives.find((exec) => exec.id === id);
}

