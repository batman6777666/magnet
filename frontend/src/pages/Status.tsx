import { useState, useEffect, useCallback } from 'react';
import ServerBadge from '../components/ServerBadge';
import LoadingBar from '../components/LoadingBar';
import apiClient from '../api/client';
import { formatUptime } from '../utils/helpers';

export default function Status() {
  const [health, setHealth] = useState<{ status: string; uptime: number } | null>(null);
  const [ping, setPing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthData, _pingResult] = await Promise.all([
        apiClient.health(),
        apiClient.ping(),
      ]);
      setHealth(healthData);
      setPing('ok');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach server');
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="gradient-text">System Status</span>
          </h1>
          <p className="text-gray-400">Real-time status of all Magnet API services.</p>
        </div>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="btn-secondary flex items-center gap-2 text-sm shrink-0"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <LoadingBar />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Connection Error</p>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">API Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'}`} />
                <span className={`text-sm font-medium ${health?.status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                  {health?.status === 'ok' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Uptime</span>
              <span className="text-sm text-gray-200 font-mono">{health ? formatUptime(health.uptime) : '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Ping Test</span>
              <span className={`text-sm font-medium ${ping === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                {ping === 'ok' ? 'Passing' : 'Failing'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Last Checked</h3>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-200">{lastChecked || 'Not yet checked'}</p>
              <p className="text-xs text-gray-500">Auto-refresh available</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-100 mb-4">Component Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ServerBadge
          status={health?.status === 'ok' ? 'online' : 'offline'}
          label="API Server"
          description="Handles incoming API requests"
        />
        <ServerBadge
          status={health?.status === 'ok' ? 'online' : 'degraded'}
          label="Chromium / Puppeteer"
          description="Renders pages for extraction"
        />
        <ServerBadge
          status="online"
          label="Storage / Cache"
          description="Caches extraction results"
        />
      </div>
    </div>
  );
}
