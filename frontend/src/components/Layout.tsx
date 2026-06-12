import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/tester', label: 'API Tester' },
  { path: '/docs', label: 'Docs' },
  { path: '/keys', label: 'Keys' },
  { path: '/status', label: 'Status' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-lg border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-200">
                M
              </div>
              <span className="font-bold text-lg text-gray-100 hidden sm:block">Magnet API</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-2 pl-2 border-l border-surface-700">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-surface-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-surface-700 bg-surface-900/95 backdrop-blur-lg">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-surface-700 bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  M
                </div>
                <span className="font-bold text-gray-100">Magnet API</span>
              </div>
              <p className="text-sm text-gray-400">Reliable media metadata extraction for developers.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/docs" className="block text-sm text-gray-400 hover:text-primary-400 transition-colors">Documentation</Link>
                <Link to="/keys" className="block text-sm text-gray-400 hover:text-primary-400 transition-colors">Get API Key</Link>
                <Link to="/status" className="block text-sm text-gray-400 hover:text-primary-400 transition-colors">Status</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Status</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                <span className="text-sm text-gray-400">All systems operational</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-700 text-center">
            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Magnet API. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
