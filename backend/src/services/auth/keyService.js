const keyStore = require('../storage/keyStore');

function createKey(name, email) {
  return keyStore.createKey(name, email);
}

function validateKey(key) {
  return keyStore.validateKey(key);
}

function trackUsage(key) {
  keyStore.trackUsage(key);
}

function listKeys() {
  return keyStore.listKeys();
}

function revokeKey(key) {
  return keyStore.revokeKey(key);
}

module.exports = { createKey, validateKey, trackUsage, listKeys, revokeKey };
