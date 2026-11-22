// Shared secret the client sends to read/write the API. Not a strong secret
// (it ships in the bundle) but it stops anonymous scraping and makes the API
// non-obvious to outsiders. Rotate by changing BOTH this and workers/api.js.
export const APP_KEY = 'cf-app-7f3a9c2e1b5d4a8';