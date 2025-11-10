/**
 * Jest setup file to polyfill Node.js globals for testing
 * This is needed for cheerio 1.0.0 which requires ReadableStream
 */

// Polyfill ReadableStream for Node.js < 18 or Jest environment
if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream, WritableStream, TransformStream } = require('stream/web');
  global.ReadableStream = ReadableStream;
  global.WritableStream = WritableStream;
  global.TransformStream = TransformStream;
}

// Polyfill other Web Streams API if needed
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Suppress console.error during tests to avoid cluttering output
// Tests intentionally trigger errors to verify error handling
global.console.error = jest.fn();