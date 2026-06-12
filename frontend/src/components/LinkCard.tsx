import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';

interface LinkCardProps {
  label: string;
  url: string | null;
  color?: 'indigo' | 'purple' | 'pink';
}

const colorMap = {
  indigo: {
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    hover: 'hover:bg-indigo-500/20',
  },
  purple: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/20',
  },
  pink: {
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    hover: 'hover:bg-pink-500/20',
  },
};

export default function LinkCard({ label, url, color = 'indigo' }: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) return;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = colorMap[color];

  return (
    <div className={`card border ${colors.border} ${colors.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
          {label}
        </span>
        {url && (
          <button
            onClick={handleCopy}
            className={`text-xs px-2.5 py-1 rounded-md transition-all duration-200 ${colors.hover} ${colors.text} font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {url ? (
        <p className="text-sm text-gray-300 font-mono truncate">{url}</p>
      ) : (
        <p className="text-sm text-gray-500 italic">Not found</p>
      )}
    </div>
  );
}
