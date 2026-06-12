import { Link } from 'react-router-dom';

const stats = [
  { label: 'Uptime', value: '99.9%', description: 'Service availability' },
  { label: 'API Calls', value: '50K+', description: 'Requests processed daily' },
  { label: 'Servers', value: '3', description: 'Nodes online' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
          All systems operational
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="gradient-text">Media Metadata</span>
          <br />
          <span className="text-gray-100">at Your Fingertips</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A powerful REST API for extracting rich metadata from movies and TV series.
          Get RPM, P2P, and UPN links with a single request.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/tester" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try API Tester
          </Link>
          <Link to="/docs" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read Docs
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card-hover text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">Why Magnet API?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need for media metadata extraction in one API.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-400">Sub-second response times with intelligent caching and optimized extraction pipelines.</p>
          </div>
          <div className="card-hover">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Reliable</h3>
            <p className="text-sm text-gray-400">Enterprise-grade infrastructure with 99.9% uptime SLA and automatic failover.</p>
          </div>
          <div className="card-hover">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Developer Friendly</h3>
            <p className="text-sm text-gray-400">Simple REST API with comprehensive documentation and examples in multiple languages.</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="card bg-gradient-to-br from-primary-600/10 to-purple-600/10 border-primary-500/20 text-center py-12 px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Get your free API key and start integrating within minutes.</p>
          <Link to="/keys" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Get Your API Key
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
