'use client';

import { useState, useEffect } from 'react';
import { Feedback, EvidenceFile } from '../types/kpi';
import { FileUpload } from './FileUpload';
import { Save, AlertCircle } from 'lucide-react';

interface FeedbackFormProps {
  kpiId: string;
  month: string;
  initialFeedback?: Feedback;
  onSave: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function FeedbackForm({ kpiId, month, initialFeedback, onSave }: FeedbackFormProps) {
  const [rootCause, setRootCause] = useState(initialFeedback?.rootCause || '');
  const [actionPlan, setActionPlan] = useState(initialFeedback?.actionPlan || '');
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(
    initialFeedback?.evidenceFiles || [],
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialFeedback) {
      setRootCause(initialFeedback.rootCause || '');
      setActionPlan(initialFeedback.actionPlan || '');
      setEvidenceFiles(initialFeedback.evidenceFiles || []);
    }
  }, [initialFeedback]);

  const handleSave = async () => {
    if (!rootCause.trim() && !actionPlan.trim() && evidenceFiles.length === 0) {
      alert('최소한 원인 분석, 행동 계획, 또는 증빙 파일 중 하나는 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        kpiId,
        month,
        rootCause: rootCause.trim() || undefined,
        actionPlan: actionPlan.trim() || undefined,
        evidenceFiles,
      });
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          실적 피드백 및 행동 계획
        </h3>
      </div>

      <div>
        <label
          htmlFor="rootCause"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          원인 분석 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            (목표와 차이가 발생한 원인을 분석해주세요)
          </span>
        </label>
        <textarea
          id="rootCause"
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="예: 신규 고객 확보가 목표 대비 부족한 이유는 경쟁사 신제품 출시로 인한 시장 경쟁 심화와 내부 영업 인력 부족이 주요 원인으로 분석됩니다."
        />
      </div>

      <div>
        <label
          htmlFor="actionPlan"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          다음 달 행동 계획 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            (구체적인 개선 방안과 실행 계획을 작성해주세요)
          </span>
        </label>
        <textarea
          id="actionPlan"
          value={actionPlan}
          onChange={(e) => setActionPlan(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="예: 1) 영업 인력 2명 추가 채용 (목표: 12월 말까지) 2) 경쟁 제품 대비 차별화 포인트 강화를 위한 마케팅 자료 제작 3) 기존 고객 재방문 프로모션 실시"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          실적 증빙 파일 첨부
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            (Excel, PDF, Image 등)
          </span>
        </label>
        <FileUpload
          kpiId={kpiId}
          existingFiles={evidenceFiles}
          onFilesChange={setEvidenceFiles}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}

