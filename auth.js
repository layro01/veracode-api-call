const sjcl = require('sjcl');
const crypto = require('crypto');
const { URL } = require('url');

const AUTHORIZATION_SCHEME = 'VERACODE-HMAC-SHA-256';
const REQUEST_VERSION = 'vcode_request_version_1';
const NONCE_SIZE = 16;

function computeHashHex(message, keyHex) {
  const keyBits = sjcl.codec.hex.toBits(keyHex);
  // eslint-disable-next-line new-cap
  const hmacBits = (new sjcl.misc.hmac(keyBits, sjcl.hash.sha256)).mac(message);
  const hmac = sjcl.codec.hex.fromBits(hmacBits);
  return hmac;
}

function calculateDataSignature(apiKeyBytes, nonceBytes, dateStamp, data) {
  const kNonce = computeHashHex(nonceBytes, apiKeyBytes);
  const kDate = computeHashHex(dateStamp, kNonce);
  const kSig = computeHashHex(REQUEST_VERSION, kDate);
  const kFinal = computeHashHex(data, kSig);
  return kFinal;
}

function newNonce() {
  return crypto.randomBytes(NONCE_SIZE).toString('hex').toUpperCase();
}

function toHexBinary(input) {
  return sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(input));
}

function generateAuthHeader(apiId, apiKey, fullUrl, httpMethod) {
  const urlObject = new URL(fullUrl);
  const url = `${urlObject.pathname}${urlObject.search}`;
  const data = `id=${apiId}&host=${urlObject.hostname}&url=${url}&method=${httpMethod}`;
  const timestamp = Date.now().toString();
  const nonceBytes = newNonce(NONCE_SIZE);
  const dataSignature = calculateDataSignature(apiKey, nonceBytes, timestamp, data);
  const authorizationParam = `id=${apiId},ts=${timestamp},nonce=${toHexBinary(nonceBytes)},sig=${dataSignature}`;
  const header = `${AUTHORIZATION_SCHEME} ${authorizationParam}`;
  return header;
}

module.exports.generateAuthHeader = generateAuthHeader;
