/**
 * WebSocket Test for Hello Gateway
 * Run with: npx ts-node scripts/test-hello-ws.ts
 */

import { io, Socket } from 'socket.io-client';

// ============================================================================
// Configuration
// ============================================================================

const SERVER_URL = 'http://localhost:3000';
const TIMEOUT_MS = 3000;

// ============================================================================
// Test Helpers
// ============================================================================

const log = {
  header: (text: string) => console.log(`\n\x1b[34m═══ ${text} ═══\x1b[0m\n`),
  pass: (text: string) => console.log(`\x1b[32m✓ ${text}\x1b[0m`),
  fail: (text: string) => console.log(`\x1b[31m✗ ${text}\x1b[0m`),
  info: (text: string) => console.log(`\x1b[33m→ ${text}\x1b[0m`),
  response: (data: unknown) => console.log('  Response:', JSON.stringify(data, null, 2)),
};

// NestJS gateway returns { event, data } which gets emitted as a separate event
function emitAndListen(socket: Socket, sendEvent: string, listenEvent: string, payload: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS);

    socket.once(listenEvent, (data: unknown) => {
      clearTimeout(timer);
      resolve(data);
    });

    socket.emit(sendEvent, payload);
  });
}

// ============================================================================
// Test Definitions
// ============================================================================

interface TestCase {
  name: string;
  sendEvent: string;
  listenEvent: string;
  payload: unknown;
  validate: (response: unknown) => boolean;
}

const tests: TestCase[] = [
  {
    name: 'Ping returns pong',
    sendEvent: 'ping',
    listenEvent: 'pong',
    payload: {},
    validate: (res: any) => res?.timestamp != null,
  },
  {
    name: 'Hello with no name returns "Hello, World!"',
    sendEvent: 'hello',
    listenEvent: 'hello_response',
    payload: {},
    validate: (res: any) => res?.message?.includes('Hello, World'),
  },
  {
    name: 'Hello with name returns personalized greeting',
    sendEvent: 'hello',
    listenEvent: 'hello_response',
    payload: { name: 'Alice' },
    validate: (res: any) => res?.message?.includes('Hello, Alice'),
  },
];

// ============================================================================
// Test Runner
// ============================================================================

async function runTests() {
  log.header('Hello Gateway WebSocket Tests');

  // Connect
  const socket = io(SERVER_URL, { transports: ['websocket'], timeout: 5000 });

  await new Promise<void>((resolve, reject) => {
    socket.on('connect', () => {
      log.pass(`Connected (id: ${socket.id})`);
      resolve();
    });
    socket.on('connect_error', (err) => reject(err));
  });

  // Run tests
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    log.header(test.name);
    log.info(`Emit "${test.sendEvent}", listen for "${test.listenEvent}"`);

    try {
      const response = await emitAndListen(socket, test.sendEvent, test.listenEvent, test.payload);
      log.response(response);

      if (test.validate(response)) {
        log.pass('PASSED');
        passed++;
      } else {
        log.fail('FAILED - validation failed');
        failed++;
      }
    } catch (err) {
      log.fail(`FAILED - ${err}`);
      failed++;
    }
  }

  // Results
  socket.disconnect();
  log.header('Results');
  console.log(`Passed: ${passed}, Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  log.fail(`Fatal: ${err.message}`);
  process.exit(1);
});
