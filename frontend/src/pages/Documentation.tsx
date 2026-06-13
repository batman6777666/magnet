import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';

const codeExamples: Record<string, string> = {
  node: `const axios = require('axios');

const API_KEY = 'your-api-key';
const BASE_URL = 'https://magnet3390-magnet.hf.space';

async function extractMovie(name) {
  try {
    const response = await axios.post(\`\${BASE_URL}/v1/extract\`, {
      type: 'movie',
      name: name
    }, {
      headers: { 'X-API-Key': API_KEY }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Extraction failed:', error.response?.data?.error);
  }
}

extractMovie('Inception');`,
  python: `import requests

API_KEY = 'your-api-key'
BASE_URL = 'https://magnet3390-magnet.hf.space'

def extract_movie(name):
    response = requests.post(
        f"{BASE_URL}/v1/extract",
        json={
            "type": "movie",
            "name": name
        },
        headers={"X-API-Key": API_KEY}
    )
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(response.json().get("error", "Request failed"))

result = extract_movie("Inception")
print(result)`,
  php: `<?php

$apiKey = 'your-api-key';
$baseUrl = 'https://magnet3390-magnet.hf.space';

function extractMovie($name) {
    global $apiKey, $baseUrl;

    $ch = curl_init("$baseUrl/v1/extract");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "X-API-Key: $apiKey"
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'type' => 'movie',
            'name' => $name
        ]),
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    throw new Exception(json_decode($response, true)['error']);
}

print_r(extractMovie('Inception'));`,
  curl: `# Register for an API key
curl -X POST https://magnet3390-magnet.hf.space/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Your Name", "email": "you@example.com"}'

# Extract movie metadata
curl -X POST https://magnet3390-magnet.hf.space/v1/extract \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "movie", "name": "Inception"}'

# Extract series metadata
curl -X POST https://magnet3390-magnet.hf.space/v1/extract \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "series", "name": "Breaking Bad", "season": 1, "episode": 1}'`,
};

interface CopyButtonProps {
  code: string;
  label?: string;
}

function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium focus:outline-none"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, language, title }: { code: string; language?: string; title?: string }) {
  return (
    <div className="card border border-surface-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-850 border-b border-surface-700">
        <span className="text-xs text-gray-500 font-mono">{title || language || 'code'}</span>
        <CopyButton code={code} />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
}

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="gradient-text">Documentation</span>
        </h1>
        <p className="text-gray-400">Everything you need to integrate the Magnet API into your application.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Quick Start</h2>
          <div className="space-y-4">
            <div className="card-hover flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Get an API Key</h3>
                <p className="text-sm text-gray-400">Sign up for a free account on the <a href="/keys" className="text-primary-400 hover:text-primary-300">Keys page</a> to receive your API key.</p>
              </div>
            </div>
            <div className="card-hover flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Make Your First Request</h3>
                <p className="text-sm text-gray-400">Use the API Tester or send a cURL request to extract metadata for any movie or series.</p>
              </div>
            </div>
            <div className="card-hover flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Integrate</h3>
                <p className="text-sm text-gray-400">Use one of our code examples to integrate the API into your application in minutes.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Authentication</h2>
          <div className="card mb-4">
            <p className="text-sm text-gray-300 mb-4">All API requests require authentication via an API key. Include your key in the <code className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded text-xs font-mono">X-API-Key</code> header.</p>
            <div className="bg-surface-900 border border-surface-700 rounded-lg p-4">
              <p className="text-sm font-mono text-gray-300 mb-2"><span className="text-gray-500"># Header format</span></p>
              <p className="text-sm font-mono text-gray-300"><span className="text-purple-400">X-API-Key</span>: <span className="text-green-400">your-api-key-here</span></p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Endpoints</h2>

          <div className="space-y-8">
            <div className="card border border-surface-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30">POST</span>
                <code className="text-sm font-mono text-gray-200">/auth/register</code>
              </div>
              <p className="text-sm text-gray-400 mb-4">Register a new account and receive an API key.</p>

              <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
              <div className="bg-surface-900 border border-surface-700 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-700">
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Field</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Required</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-surface-700">
                      <td className="px-4 py-2 font-mono text-gray-200">name</td>
                      <td className="px-4 py-2 text-gray-400">string</td>
                      <td className="px-4 py-2"><span className="text-green-400">Yes</span></td>
                      <td className="px-4 py-2 text-gray-400">Your name or application name</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-gray-200">email</td>
                      <td className="px-4 py-2 text-gray-400">string</td>
                      <td className="px-4 py-2"><span className="text-gray-500">No</span></td>
                      <td className="px-4 py-2 text-gray-400">Contact email (optional)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-sm font-semibold text-gray-300 mb-2">Example</h4>
              <CodeBlock code={codeExamples.curl.split('\n\n')[0]} language="bash" title="cURL" />
            </div>

            <div className="card border border-surface-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30">POST</span>
                <code className="text-sm font-mono text-gray-200">/v1/extract</code>
              </div>
              <p className="text-sm text-gray-400 mb-4">Extract metadata for a movie or TV series. Requires authentication.</p>

              <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
              <div className="bg-surface-900 border border-surface-700 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-700">
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Field</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Required</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-surface-700">
                      <td className="px-4 py-2 font-mono text-gray-200">type</td>
                      <td className="px-4 py-2 text-gray-400">string</td>
                      <td className="px-4 py-2"><span className="text-green-400">Yes</span></td>
                      <td className="px-4 py-2 text-gray-400"><code className="text-xs text-primary-400">"movie"</code> or <code className="text-xs text-primary-400">"series"</code></td>
                    </tr>
                    <tr className="border-b border-surface-700">
                      <td className="px-4 py-2 font-mono text-gray-200">name</td>
                      <td className="px-4 py-2 text-gray-400">string</td>
                      <td className="px-4 py-2"><span className="text-green-400">Yes</span></td>
                      <td className="px-4 py-2 text-gray-400">Movie or series name</td>
                    </tr>
                    <tr className="border-b border-surface-700">
                      <td className="px-4 py-2 font-mono text-gray-200">season</td>
                      <td className="px-4 py-2 text-gray-400">number</td>
                      <td className="px-4 py-2"><span className="text-yellow-400">Conditional</span></td>
                      <td className="px-4 py-2 text-gray-400">Required for series type</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-gray-200">episode</td>
                      <td className="px-4 py-2 text-gray-400">number</td>
                      <td className="px-4 py-2"><span className="text-yellow-400">Conditional</span></td>
                      <td className="px-4 py-2 text-gray-400">Required for series type</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-sm font-semibold text-gray-300 mb-2">Examples</h4>
              <div className="space-y-3">
                <CodeBlock code={codeExamples.curl.split('\n\n')[1].trim()} language="bash" title="Movie Extraction" />
                <CodeBlock code={codeExamples.curl.split('\n\n')[2].trim()} language="bash" title="Series Extraction" />
              </div>
            </div>

            <div className="card border border-surface-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">GET</span>
                <code className="text-sm font-mono text-gray-200">/health</code>
              </div>
              <p className="text-sm text-gray-400 mb-2">Health check endpoint to verify API availability.</p>
              <p className="text-sm text-gray-400">Returns <code className="text-xs text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded font-mono">{"{ status: \"ok\", uptime: 12345 }"}</code></p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Response Format</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Success Response</h3>
              <CodeBlock code={`{
  "success": true,
  "request_time_ms": 342,
  "data": {
    "type": "movie",
    "original_name": "Inception",
    "normalized_name": "inception-2010",
    "source_url": "https://example.com/inception",
    "links": {
      "rpm": "https://rpm.example.com/...",
      "p2p": "https://p2p.example.com/...",
      "upn": "https://upn.example.com/..."
    },
    "generated_at": "2024-01-01T00:00:00Z"
  }
}`} language="json" title="200 OK" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Error Response</h3>
              <CodeBlock code={`{
  "success": false,
  "error": "Invalid API key",
  "code": "INVALID_API_KEY"
}`} language="json" title="4xx/5xx" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Error Codes</h2>
          <div className="card border border-surface-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-850">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Code</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">HTTP Status</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-700">
                  <td className="px-4 py-3 font-mono text-red-400">INVALID_API_KEY</td>
                  <td className="px-4 py-3 text-gray-400">401</td>
                  <td className="px-4 py-3 text-gray-400">The provided API key is invalid or expired</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="px-4 py-3 font-mono text-red-400">RATE_LIMITED</td>
                  <td className="px-4 py-3 text-gray-400">429</td>
                  <td className="px-4 py-3 text-gray-400">Rate limit exceeded for your tier</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="px-4 py-3 font-mono text-red-400">VALIDATION_ERROR</td>
                  <td className="px-4 py-3 text-gray-400">400</td>
                  <td className="px-4 py-3 text-gray-400">Invalid request body or missing required fields</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="px-4 py-3 font-mono text-red-400">NOT_FOUND</td>
                  <td className="px-4 py-3 text-gray-400">404</td>
                  <td className="px-4 py-3 text-gray-400">The requested media could not be found</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="px-4 py-3 font-mono text-red-400">INTERNAL_ERROR</td>
                  <td className="px-4 py-3 text-gray-400">500</td>
                  <td className="px-4 py-3 text-gray-400">An unexpected server error occurred</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Rate Limiting</h2>
          <div className="card">
            <p className="text-sm text-gray-300 mb-4">Rate limits are enforced per API key and reset daily at midnight UTC.</p>
            <div className="bg-surface-900 border border-surface-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-700">
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Tier</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Daily Limit</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Rate (per second)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-surface-700">
                    <td className="px-4 py-2 text-gray-200">Free</td>
                    <td className="px-4 py-2 text-gray-400">100 requests</td>
                    <td className="px-4 py-2 text-gray-400">10 req/s</td>
                  </tr>
                  <tr className="border-b border-surface-700">
                    <td className="px-4 py-2 text-gray-200">Pro</td>
                    <td className="px-4 py-2 text-gray-400">10,000 requests</td>
                    <td className="px-4 py-2 text-gray-400">100 req/s</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-200">Enterprise</td>
                    <td className="px-4 py-2 text-gray-400">Custom</td>
                    <td className="px-4 py-2 text-gray-400">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Integration Guide</h2>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Architecture Overview</h3>
            <div className="bg-surface-900 border border-surface-700 rounded-lg p-6 mb-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <pre className="text-gray-300">
{`┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│             │     │              │     │             │
│  Your App   │────▶│  Magnet API  │────▶│  Scraper    │
│             │     │              │     │  Engine     │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                      │
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────┐
                    │   Cache      │     │  Media      │
                    │   Layer      │     │  Sources    │
                    └──────────────┘     └─────────────┘`}
              </pre>
            </div>
            <p className="text-sm text-gray-400">The Magnet API acts as a bridge between your application and various media sources. The scraper engine extracts metadata and generates RPM, P2P, and UPN links, with a caching layer for frequently requested content.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Code Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Node.js / JavaScript</h3>
              <CodeBlock code={codeExamples.node} language="javascript" title="Node.js" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Python / Flask</h3>
              <CodeBlock code={codeExamples.python} language="python" title="Python" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">PHP</h3>
              <CodeBlock code={codeExamples.php} language="php" title="PHP" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">cURL</h3>
              <CodeBlock code={codeExamples.curl} language="bash" title="cURL" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
