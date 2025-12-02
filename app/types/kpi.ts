/**
 * @fileoverview KPI 관련 타입 정의
 * @encoding UTF-8
 */

export interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

export interface Feedback {
  id: string;
  kpiId: string;
  month: string; // YYYY-MM 형식
  rootCause?: string; // 원인 분석
  actionPlan?: string; // 행동 계획
  evidenceFiles: EvidenceFile[];
  createdAt: string;
  updatedAt: string;
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'at-risk' | 'behind';
  category: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  month?: string; // YYYY-MM 형식
  feedback?: Feedback; // 해당 월의 피드백
}

export interface Executive {
  id: string;
  name: string;
  position: string;
  kpis: KPI[];
}

export interface ActionPlan {
  id: string;
  kpiId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface AnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  actionPlans: ActionPlan[];
}

export interface MonthlyPerformance {
  month: string; // YYYY-MM 형식
  executives: Executive[];
  totalRevenue?: {
    target: number;
    current: number;
    unit: string;
  };
}

