'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, File, FileText, Image, FileSpreadsheet, FileType } from 'lucide-react';
import { EvidenceFile } from '../types/kpi';

interface FileUploadProps {
  onFilesChange: (files: EvidenceFile[]) => void;
  existingFiles?: EvidenceFile[];
  kpiId: string;
}

export function FileUpload({ onFilesChange, existingFiles = [], kpiId }: FileUploadProps) {
  const [files, setFiles] = useState<EvidenceFile[]>(() => existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevExistingFilesRef = useRef<EvidenceFile[]>(existingFiles);

  // existingFiles가 변경될 때 상태 동기화 (참조 비교로 불필요한 업데이트 방지)
  useEffect(() => {
    if (prevExistingFilesRef.current !== existingFiles) {
      prevExistingFilesRef.current = existingFiles;
      // 다음 프레임에서 상태 업데이트 (cascading render 방지)
      requestAnimationFrame(() => {
        setFiles(existingFiles);
      });
    }
  }, [existingFiles]);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: EvidenceFile[] = Array.from(selectedFiles).map((file, index) => ({
      id: `${kpiId}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (type: string, fileName: string) => {
    const lowerType = type.toLowerCase();
    const lowerName = fileName.toLowerCase();
    
    if (lowerType.includes('image') || /\.(png|jpg|jpeg|gif|webp)$/i.test(fileName)) {
      return <Image className="w-5 h-5 text-blue-500" aria-hidden="true" />;
    }
    if (lowerType.includes('pdf') || lowerName.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />;
    }
    if (
      lowerType.includes('spreadsheet') ||
      lowerType.includes('excel') ||
      lowerType.includes('csv') ||
      lowerType.includes('sheet') ||
      /\.(xlsx|xls|csv)$/i.test(fileName)
    ) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" aria-hidden="true" />;
    }
    if (
      lowerType.includes('word') ||
      lowerType.includes('document') ||
      /\.(doc|docx)$/i.test(fileName)
    ) {
      return <FileType className="w-5 h-5 text-blue-600" aria-hidden="true" />;
    }
    if (lowerType.includes('text') || lowerName.endsWith('.txt')) {
      return <FileText className="w-5 h-5 text-gray-500" aria-hidden="true" />;
    }
    return <File className="w-5 h-5 text-gray-400" aria-hidden="true" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Excel, PDF, Word, Image, CSV, TXT 등 실적 증빙 파일을 업로드하세요
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          파일 선택
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg,.csv,.txt,.doc,.docx,.gif,.webp"
          onChange={(e) => {
            handleFileSelect(e.target.files);
            // 입력 필드 초기화 (같은 파일 다시 선택 가능하도록)
            if (e.target) {
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            첨부된 파일 ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-gray-500 dark:text-gray-400">
                    {getFileIcon(file.type, file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="ml-4 p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  aria-label="파일 삭제"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

