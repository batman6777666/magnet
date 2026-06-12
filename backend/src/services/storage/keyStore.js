const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR  = path.join(__dirname, '..', '..', '..', 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(KEYS_FILE)) fs.writeFileSync(KEYS_FILE, '{}', 'utf8');
}

function readStore() {
  try {
    ensureStore();
    return JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(KEYS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function generateKey() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(16).toString('hex');
  const checksum = crypto.createHash('sha256').update(ts + rand).digest('hex').slice(0, 8);
  return `mk-${ts}-${rand}-${checksum}`;
}

function createKey(name, email) {
  const store = readStore();
  let key;
  let attempts = 0;
  do {
    key = generateKey();
    attempts++;
    if (attempts > 10) throw new Error('Failed to generate unique API key after 10 attempts');
  } while (store[key]);

  store[key] = {
    name:         name.trim(),
    email:        email ? email.trim().toLowerCase() : null,
    active:       true,
    requestCount: 0,
    createdAt:    new Date().toISOString(),
    lastUsedAt:   null,
  };

  writeStore(store);
  return key;
}

function validateKey(key) {
  if (!key || typeof key !== 'string') return null;
  const store = readStore();
  const record = store[key];
  if (!record || !record.active) return null;
  return record;
}

function trackUsage(key) {
  try {
    const store = readStore();
    if (store[key]) {
      store[key].requestCount += 1;
      store[key].lastUsedAt = new Date().toISOString();
      writeStore(store);
    }
  } catch {}
}

function listKeys() {
  const store = readStore();
  return Object.entries(store).map(([key, rec]) => ({
    keyPreview: key.slice(0, 12) + '…',
    ...rec,
  }));
}

function revokeKey(key) {
  const store = readStore();
  if (!store[key]) return false;
  store[key].active = false;
  writeStore(store);
  return true;
}

module.exports = { createKey, validateKey, trackUsage, listKeys, revokeKey };
