interface ServerBadgeProps {
  status: 'online' | 'offline' | 'degraded';
  label: string;
  description?: string;
}

const statusConfig = {
  online: {
    dot: 'bg-green-500',
    dotGlow: 'shadow-green-500/50',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    label: 'Online',
  },
  offline: {
    dot: 'bg-red-500',
    dotGlow: 'shadow-red-500/50',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'Offline',
  },
  degraded: {
    dot: 'bg-yellow-500',
    dotGlow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    label: 'Degraded',
  },
};

export default function ServerBadge({ status, label, description }: ServerBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={`card border ${config.border} ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-200">{label}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${config.dot} shadow-sm ${config.dotGlow}`} />
          <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
    </div>
  );
}
