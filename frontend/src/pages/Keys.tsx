import { useState, useCallback } from 'react';
import { useRegister } from '../hooks/useApi';
import { copyToClipboard } from '../utils/helpers';

export default function Keys() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const { data, loading, error, register, reset } = useRegister();
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await register(name.trim(), email.trim() || undefined);
  }, [name, email, register]);

  const handleCopy = useCallback(async () => {
    if (!data?.data?.api_key) return;
    await copyToClipboard(data.data.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [data]);

  if (data?.data?.api_key) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">API Key Generated</h2>
          <p className="text-gray-400 mb-6">Save this key now. You will not be able to see it again.</p>

          <div className="bg-surface-900 border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-yellow-300/90">Save this API key now. For security reasons, it will not be shown again.</p>
            </div>
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Your API Key</span>
              <button
                onClick={handleCopy}
                className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors focus:outline-none"
              >
                {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
              </button>
            </div>
            <p className="text-sm font-mono text-gray-200 break-all bg-surface-800 rounded p-3 border border-surface-700">{data.data.api_key}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={reset} className="btn-secondary text-sm">
              Generate Another Key
            </button>
            <a href="/tester" className="btn-primary text-sm">
              Try API Tester
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="gradient-text">Get Your API Key</span>
        </h1>
        <p className="text-gray-400">Register for a free API key to start using the Magnet API.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label" htmlFor="reg-name">Name</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Your name or app name"
              className={`input-field ${nameFocused ? 'border-primary-500 ring-1 ring-primary-500/30' : ''}`}
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="reg-email">Email <span className="text-gray-500">(optional)</span></label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="you@example.com"
              className={`input-field ${emailFocused ? 'border-primary-500 ring-1 ring-primary-500/30' : ''}`}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Generate API Key
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">By registering you agree to our terms of service. Free tier includes 100 requests per day.</p>
      </div>
    </div>
  );
}
