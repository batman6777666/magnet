import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';

interface CodeSnippetProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeSnippet({ code, language = 'bash', title }: CodeSnippetProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card border border-surface-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {title && <span className="font-medium">{title}</span>}
          {!title && <span className="text-xs uppercase tracking-wider text-gray-500">{language}</span>}
        </div>
        <div className="flex items-center gap-3">
          {expanded && (
            <span
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-surface-700">
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
