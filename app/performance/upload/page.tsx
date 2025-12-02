'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '../../components/FileUpload';
import { KPIManagement } from '../../components/KPIManagement';
import { EvidenceFile } from '../../types/kpi';
import { Upload, CheckCircle, AlertCircle, FileText, Trash2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function PerformanceUploadPage() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [uploadedFiles, setUploadedFiles] = useState<EvidenceFile[]>([]);
  const [savedFiles, setSavedFiles] = useState<EvidenceFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 선택된 월의 저장된 파일 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storageKey = `performance-files-${selectedMonth}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedFiles(Array.isArray(parsed) ? parsed : []);
      } else {
        setSavedFiles([]);
      }
    } catch (error) {
      console.error('파일 로드 오류:', error);
      setSavedFiles([]);
    }
  }, [selectedMonth]);

  const handleFilesChange = (files: EvidenceFile[]) => {
    setUploadedFiles(files);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다.');
      }
      
      // 실제 파일 업로드 로직 (현재는 로컬 스토리지에 메타데이터만 저장)
      const storageKey = `performance-files-${selectedMonth}`;
      const existingFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedFiles = [...existingFiles, ...uploadedFiles];
      localStorage.setItem(storageKey, JSON.stringify(updatedFiles));

      // 성공 메시지
      setUploadStatus('success');
      setUploadedFiles([]);
      setSavedFiles(updatedFiles);
      
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('업로드 오류:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSavedFile = (fileId: string) => {
    if (typeof window === 'undefined') return;
    
    const storageKey = `performance-files-${selectedMonth}`;
    try {
      const updatedFiles = savedFiles.filter((f) => f.id !== fileId);
      localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
      setSavedFiles(updatedFiles);
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                성과자료 업로드 페이지 | KPI등록
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              부서별 담당자별 KPI를 등록하고, 월별 성과 데이터를 업로드하여 관리하세요
            </p>
          </div>

          {/* 월별 선택 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              업로드 대상 월
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (11 - i));
                const monthValue = format(date, 'yyyy-MM');
                const monthLabel = format(date, 'yyyy년 MM월');
                return (
                  <option key={monthValue} value={monthValue}>
                    {monthLabel}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 파일 업로드 영역 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                성과자료 파일 업로드
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              지원 형식: Excel (.xlsx, .xls), PDF (.pdf), Word (.doc, .docx), Image (.png, .jpg, .jpeg), CSV (.csv), TXT (.txt)
            </p>
            
            <FileUpload
              kpiId={`performance-upload-${selectedMonth}`}
              existingFiles={uploadedFiles}
              onFilesChange={handleFilesChange}
            />

            {uploadedFiles.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>업로드 중...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>파일 업로드 ({uploadedFiles.length}개)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">
                  성공적으로 업로드되었습니다!
                </span>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">
                  업로드 중 오류가 발생했습니다. 다시 시도해주세요.
                </span>
              </div>
            )}
          </div>

          {/* 저장된 파일 목록 */}
          {savedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  저장된 파일 ({savedFiles.length}개)
                </h2>
              </div>
              <div className="space-y-2">
                {savedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedFile(file.id)}
                      className="ml-4 p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      aria-label="파일 삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPI 관리 섹션 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                KPI 등록 및 관리
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              부서별 담당자별로 새로운 KPI를 등록하고, 월별 목표를 설정할 수 있습니다.
            </p>
            <KPIManagement selectedMonth={selectedMonth} />
          </div>

          {/* 업로드 가이드 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  사용 가이드
                </h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li>• <strong>KPI 등록:</strong> 담당자를 선택한 후 새로운 KPI를 추가할 수 있습니다</li>
                  <li>• <strong>월별 목표 설정:</strong> 각 KPI의 월별 목표값을 클릭하여 수정할 수 있습니다</li>
                  <li>• <strong>KPI 삭제:</strong> 커스텀으로 등록한 KPI는 삭제 버튼으로 제거할 수 있습니다</li>
                  <li>• <strong>파일 업로드:</strong> 매월 초 전월 성과자료를 업로드해주세요</li>
                  <li>• <strong>지원 형식:</strong> Excel, PDF, Word, Image, CSV, TXT</li>
                  <li>• 업로드된 파일은 AI 분석에 활용됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

