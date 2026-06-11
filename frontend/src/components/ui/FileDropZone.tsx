import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import type { UploadedContent } from '../../lib/types';

export interface FileDropZoneProps {
  onContentReady: (content: UploadedContent) => void;
  onClear: () => void;
  currentContent: UploadedContent | null;
  /** Placeholder text for the paste textarea */
  pastePlaceholder?: string;
  /** Pre-filled sample text for the paste tab */
  sampleText?: string;
  label: string;
}

type ActiveTab = 'upload' | 'paste';

export function FileDropZone({
  onContentReady,
  onClear,
  currentContent,
  pastePlaceholder = 'Paste your text here…',
  sampleText,
  label,
}: FileDropZoneProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [pasteText, setPasteText] = useState(sampleText ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      // In this MVP we read the file as text (works for .txt and simulates PDF/DOCX)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) ?? '';
        onContentReady({ source: 'file', text, fileName: file.name });
      };
      reader.readAsText(file);
    },
    [onContentReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      onContentReady({ source: 'paste', text: pasteText.trim() });
    }
  };

  const handleClear = () => {
    onClear();
    setPasteText(sampleText ?? '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // If content is already loaded, show a success state
  if (currentContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-teal/40 bg-teal/5 rounded-2xl p-6 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="text-teal shrink-0" size={22} />
          <div>
            <p className="text-sm font-semibold text-gray-light">
              {currentContent.source === 'file'
                ? currentContent.fileName ?? 'File uploaded'
                : 'Text pasted'}
            </p>
            <p className="text-xs text-gray-mid mt-0.5">
              {currentContent.text.length.toLocaleString()} characters
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          aria-label={`Remove ${label}`}
          className="text-gray-mid hover:text-coral transition-colors duration-200 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-teal"
        >
          <X size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Tab toggle */}
      <div
        className="flex bg-surface rounded-xl p-1 gap-1"
        role="tablist"
        aria-label={`${label} input method`}
      >
        {(['upload', 'paste'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === tab
                ? 'bg-surface-raised text-teal shadow-sm'
                : 'text-gray-mid hover:text-gray-light',
            ].join(' ')}
          >
            {tab === 'upload' ? 'Upload file' : 'Paste text'}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label={`Drop or click to upload ${label}`}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              className={[
                'border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200',
                isDragging
                  ? 'border-teal bg-teal/10 scale-[1.01]'
                  : 'border-white/15 hover:border-teal/50 hover:bg-white/3',
              ].join(' ')}
            >
              <div
                className={[
                  'p-3 rounded-full transition-colors duration-200',
                  isDragging ? 'bg-teal/20' : 'bg-white/5',
                ].join(' ')}
              >
                <Upload
                  size={24}
                  className={isDragging ? 'text-teal' : 'text-gray-mid'}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-light">
                  Drop your file here, or{' '}
                  <span className="text-teal underline underline-offset-2">browse</span>
                </p>
                <p className="text-xs text-gray-mid mt-1">PDF, DOCX, or TXT</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="sr-only"
              aria-label={`Upload ${label} file`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <label htmlFor={`paste-${label}`} className="sr-only">
              {label} text
            </label>
            <textarea
              id={`paste-${label}`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={pastePlaceholder}
              rows={8}
              className="w-full bg-surface border border-white/10 rounded-xl p-4 text-sm text-gray-light placeholder-gray-dark resize-y focus-visible:outline-2 focus-visible:outline-teal transition-colors duration-200 font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-mid">
                {pasteText.length > 0
                  ? `${pasteText.length.toLocaleString()} characters`
                  : 'Paste your text above'}
              </span>
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteText.trim()}
                className={[
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  pasteText.trim()
                    ? 'bg-teal text-navy hover:bg-teal/90 cursor-pointer'
                    : 'bg-white/5 text-gray-dark cursor-not-allowed',
                ].join(' ')}
              >
                <FileText size={14} />
                Use this text
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
