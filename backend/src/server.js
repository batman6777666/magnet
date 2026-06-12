const app = require('./app');
const config = require('./config');
const { initPool, shutdownPool } = require('./services/extractor/browserPool');

async function start() {
  try {
    await initPool();
    app.listen(config.PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║   VIDEO EMBED LINK EXTRACTOR API v2.0   ║');
      console.log(`║   Port : ${String(config.PORT).padEnd(32)}║`);
      console.log(`║   Env  : ${String(config.NODE_ENV).padEnd(32)}║`);
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
      console.log(`  POST /auth/register  (get your API key)`);
      console.log(`  POST /v1/extract     (X-API-Key required)`);
      console.log(`  POST /inspect        (no auth — URL inspection)`);
      console.log(`  GET  /health         http://localhost:${config.PORT}/health`);
      console.log('');
    });
  } catch (err) {
    console.error('[FATAL] Server failed to start:', err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\n[${signal}] Shutting down gracefully…`);
  try { await shutdownPool(); } catch {}
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
