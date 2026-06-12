import { useState, useCallback } from 'react';
import ApiKeyInput from '../components/ApiKeyInput';
import LinkCard from '../components/LinkCard';
import LoadingBar from '../components/LoadingBar';
import CodeSnippet from '../components/CodeSnippet';
import { useExtract } from '../hooks/useApi';
import type { ContentType } from '../types';

export default function ApiTester() {
  const [apiKey, setApiKey] = useState('');
  const [contentType, setContentType] = useState<ContentType>('movie');
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [showRpm, setShowRpm] = useState(true);
  const [showP2p, setShowP2p] = useState(true);
  const [showUpn, setShowUpn] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [timing, setTiming] = useState<number | null>(null);

  const { data, loading, error, extract, reset } = useExtract();

  const handleExtract = useCallback(async () => {
    if (!apiKey || !name) return;
    setTiming(null);
    const start = Date.now();
    try {
      const payload: { type: ContentType; name: string; season?: number; episode?: number } = { type: contentType, name };
      if (contentType === 'series') {
        if (season) payload.season = parseInt(season, 10);
        if (episode) payload.episode = parseInt(episode, 10);
      }
      const result = await extract(apiKey, payload);
      if (result.request_time_ms) {
        setTiming(result.request_time_ms);
      } else {
        setTiming(Date.now() - start);
      }
    } catch {
      setTiming(Date.now() - start);
    }
  }, [apiKey, contentType, name, season, episode, extract]);

  const requestCode = `curl -X POST ${import.meta.env.VITE_API_BASE || 'https://api.magnet.dev'}/v1/extract \\
  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
    type: contentType,
    name: name || 'EXAMPLE_NAME',
    ...(contentType === 'series' ? { season: season ? parseInt(season, 10) : 1, episode: episode ? parseInt(episode, 10) : 1 } : {}),
  }, null, 2)}'`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="gradient-text">API Tester</span>
        </h1>
        <p className="text-gray-400">Test the extraction API directly from your browser.</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="space-y-5">
            <ApiKeyInput value={apiKey} onChange={setApiKey} />

            <div>
              <label className="input-label">Content Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setContentType('movie'); setSeason(''); setEpisode(''); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                    contentType === 'movie'
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'bg-surface-900 border border-surface-700 text-gray-400 hover:text-gray-200 hover:border-surface-600'
                  }`}
                >
                  Movie
                </button>
                <button
                  onClick={() => setContentType('series')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                    contentType === 'series'
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'bg-surface-900 border border-surface-700 text-gray-400 hover:text-gray-200 hover:border-surface-600'
                  }`}
                >
                  Series
                </button>
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="name">
                {contentType === 'movie' ? 'Movie Name' : 'Series Name'}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.target.classList.add('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                onBlur={(e) => e.target.classList.remove('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                placeholder={contentType === 'movie' ? 'e.g. Inception' : 'e.g. Breaking Bad'}
                className="input-field"
              />
            </div>

            {contentType === 'series' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label" htmlFor="season">Season</label>
                  <input
                    id="season"
                    type="number"
                    min="1"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    onFocus={(e) => e.target.classList.add('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                    onBlur={(e) => e.target.classList.remove('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                    placeholder="1"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="episode">Episode</label>
                  <input
                    id="episode"
                    type="number"
                    min="1"
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                    onFocus={(e) => e.target.classList.add('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                    onBlur={(e) => e.target.classList.remove('border-primary-500', 'ring-1', 'ring-primary-500/30')}
                    placeholder="1"
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleExtract}
              disabled={loading || !apiKey || !name}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Extracting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Extract
                </>
              )}
            </button>
          </div>
        </div>

        {loading && <LoadingBar />}

        {error && (
          <div className="card border border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">Extraction Failed</p>
                <p className="text-sm text-red-300/80">{error}</p>
                <button onClick={reset} className="text-xs text-red-400 hover:text-red-300 mt-2 underline">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {data && !error && (
          <>
            {timing !== null && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed in <span className="font-mono text-gray-200">{timing}ms</span>
              </div>
            )}

            <div className="card">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Type</span>
                  <span className="text-sm text-gray-200 font-medium capitalize">{data.data.type}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Slug</span>
                  <span className="text-sm text-gray-200 font-mono">{data.data.normalized_name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Source URL</span>
                  <a href={data.data.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-400 hover:text-primary-300 font-mono truncate block">
                    {data.data.source_url}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Links</h3>
                <div className="flex items-center gap-3">
                  {(['rpm', 'p2p', 'upn'] as const).map((key) => {
                    const enabled = key === 'rpm' ? showRpm : key === 'p2p' ? showP2p : showUpn;
                    const toggle = key === 'rpm' ? setShowRpm : key === 'p2p' ? setShowP2p : setShowUpn;
                    return (
                      <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                        <span className="text-xs text-gray-500 uppercase">{key}</span>
                        <button
                          onClick={() => toggle(!enabled)}
                          className={`relative w-8 h-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                            enabled ? 'bg-primary-600' : 'bg-surface-700'
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-4' : ''}`} />
                        </button>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={showRpm ? '' : 'hidden'}>
                  <LinkCard label="RPM" url={data.data.links.rpm} color="indigo" />
                </div>
                <div className={showP2p ? '' : 'hidden'}>
                  <LinkCard label="P2P" url={data.data.links.p2p} color="purple" />
                </div>
                <div className={showUpn ? '' : 'hidden'}>
                  <LinkCard label="UPN" url={data.data.links.upn} color="pink" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${showCode ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {showCode ? 'Hide' : 'Show'} request code
              </button>
              {showCode && (
                <CodeSnippet code={requestCode} language="bash" title="cURL Request" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
