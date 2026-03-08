// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for Web APIs needed by Next.js API routes
if (typeof global.Request === 'undefined') {
  global.Request = class Request {}
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {}
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {}
}
