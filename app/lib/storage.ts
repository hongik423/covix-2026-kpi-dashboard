/**
 * @fileoverview 로컬 스토리지 기반 데이터 저장소
 * @encoding UTF-8
 */

import { Feedback, KPI } from '../types/kpi';

const STORAGE_KEY_PREFIX = 'kobix-kpi-feedback-';

export function saveFeedback(kpiId: string, month: string, feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>): void {
  const key = `${STORAGE_KEY_PREFIX}${kpiId}-${month}`;
  const feedbackData: Feedback = {
    ...feedback,
    id: `${kpiId}-${month}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(feedbackData));
  } catch (error) {
    console.error('피드백 저장 오류:', error);
  }
}

export function getFeedback(kpiId: string, month: string): Feedback | null {
  const key = `${STORAGE_KEY_PREFIX}${kpiId}-${month}`;
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as Feedback;
  } catch (error) {
    console.error('피드백 조회 오류:', error);
    return null;
  }
}

export function getAllFeedbacks(month: string): Record<string, Feedback> {
  const feedbacks: Record<string, Feedback> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX) && key.endsWith(`-${month}`)) {
        const data = localStorage.getItem(key);
        if (data) {
          const feedback = JSON.parse(data) as Feedback;
          feedbacks[feedback.kpiId] = feedback;
        }
      }
    }
  } catch (error) {
    console.error('피드백 전체 조회 오류:', error);
  }
  return feedbacks;
}

export function updateKPIWithFeedback(kpi: KPI, month: string): KPI {
  const feedback = getFeedback(kpi.id, month);
  return {
    ...kpi,
    month,
    feedback: feedback || undefined,
  };
}

