const env = require('./config/env');
const app = require('./app');

const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log('  │           FitPulse API Server             │');
  console.log('  ├──────────────────────────────────────────┤');
  console.log(`  │  Status:    running                       │`);
  console.log(`  │  Env:       ${env.nodeEnv.padEnd(29)}│`);
  console.log(`  │  Port:      ${String(PORT).padEnd(29)}│`);
  console.log(`  │  API:       ${env.apiPrefix.padEnd(29)}│`);
  console.log(`  │  Client:    ${env.clientUrl.substring(0, 29).padEnd(29)}│`);
  console.log(`  │  Health:    http://localhost:${PORT}${env.apiPrefix}/health`);
  console.log(`  │  System:    http://localhost:${PORT}${env.apiPrefix}/system`);
  console.log('  └──────────────────────────────────────────┘');
  console.log('');
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = server;
