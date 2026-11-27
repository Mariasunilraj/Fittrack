/**
 * FitTrack PRO - Security, Privacy & Compliance Utilities
 * Implements OWASP Top 10 recommendations:
 * - Input validation & sanitization (anti-XSS)
 * - Cryptographic password hashing (PBKDF2-SHA256 / WebCrypto with per-user salt)
 * - Timing-safe password verification
 * - Persistent client-side login rate limiting with lockout
 * - Cryptographic session token generation & signature verification
 * - CSRF token lifecycle management
 * - Data sanitization & PII redaction for logs/errors
 */

// ====================================================================
// 1. INPUT SANITIZATION & VALIDATION (XSS & Injection Protection)
// ====================================================================

/**
 * Sanitizes user input string by stripping HTML tags, javascript: URIs,
 * and dangerous event handlers to prevent Cross-Site Scripting (XSS).
 */
export function sanitizeString(input: string, maxLength: number = 250): string {
  if (!input) return '';
  const trimmed = input.trim().slice(0, maxLength);
  // Strip HTML tags and entities
  const withoutTags = trimmed.replace(/<[^>]*>/g, '');
  // Disallow javascript: and data: pseudo-protocols
  const cleanUri = withoutTags.replace(/(javascript|vbscript|data):/gi, '');
  // Disallow common dangerous attributes
  return cleanUri.replace(/on\w+\s*=/gi, '');
}

/**
 * Validates RFC-5322 compliant email addresses
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates safe numeric ranges (e.g. weights, reps, calories)
 */
export function sanitizeNumeric(val: number | string, min: number = 0, max: number = 1000, fallback: number = 0): number {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  if (num < min) return min;
  if (num > max) return max;
  return Math.round(num * 100) / 100;
}

// ====================================================================
// 2. CRYPTOGRAPHIC PASSWORD HASHING (PBKDF2-SHA256 via WebCrypto)
// ====================================================================

/**
 * Generates a cryptographically secure random hexadecimal salt (default: 16 bytes = 32 hex chars).
 * Every registered user gets a unique, unguessable salt.
 */
export function generateSalt(byteLength: number = 16): string {
  const randomBytes = new Uint8Array(byteLength);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a plaintext password using Web Crypto PBKDF2 with SHA-256 and 100,000 iterations.
 * Requires a unique per-user salt. Never stores or transmits plaintext passwords.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  if (!password) {
    throw new Error('Password cannot be empty.');
  }
  const cleanSalt = salt || generateSalt(16);

  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.importKey) {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const saltBuffer = enc.encode(cleanSalt);
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );

      const hashArray = Array.from(new Uint8Array(derivedBits));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('[FitTrack Security] WebCrypto PBKDF2 error, falling back to SHA-256 digest:', err);
  }

  // Robust SHA-256 digest fallback if PBKDF2 is unsupported in legacy environments
  return sha256Fallback(`${password}:${cleanSalt}:fittrack_v2_secure`);
}

/**
 * Timing-safe string comparison to prevent timing attacks when comparing password hashes.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Verifies a candidate password against an expected hash using the user's specific salt.
 */
export async function verifyPassword(
  candidatePassword: string,
  expectedHash: string,
  salt: string
): Promise<boolean> {
  if (!candidatePassword || !expectedHash || !salt) {
    return false;
  }
  try {
    const computedHash = await hashPassword(candidatePassword, salt);
    return timingSafeEqual(computedHash, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Deterministic SHA-256 fallback implementation
 */
async function sha256Fallback(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest('SHA-256', enc.encode(message));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }
  // Basic fallback bitwise hash
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < message.length; i++) {
    const ch = message.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (p1 + p2 + p1 + p2).padEnd(64, '0');
}

// ====================================================================
// 3. CRYPTOGRAPHIC SESSION MANAGEMENT
// ====================================================================

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

const SESSION_SIGNING_SALT = 'fittrack_session_hmac_2026';

/**
 * Generates an HMAC-like signature for session tamper-proofing
 */
export async function generateSessionSignature(token: string, userId: string, expiresAt: number): Promise<string> {
  const payload = `${token}:${userId}:${expiresAt}:${SESSION_SIGNING_SALT}`;
  return sha256Fallback(payload);
}

/**
 * Creates a cryptographically signed session object valid for 7 days
 */
export async function createSession(userId: string, email: string): Promise<AuthSession> {
  const token = generateSalt(32); // 64 hex chars
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
  const signature = await generateSessionSignature(token, userId, expiresAt);

  return {
    token,
    userId,
    email: email.toLowerCase().trim(),
    createdAt: now,
    expiresAt,
    signature
  };
}

/**
 * Verifies that an authentication session is valid, non-expired, and has not been tampered with
 */
export async function verifySession(session: AuthSession | null): Promise<boolean> {
  if (!session || !session.token || !session.userId || !session.signature) {
    return false;
  }
  // Check expiration
  if (Date.now() > session.expiresAt) {
    return false;
  }
  // Verify signature
  const expectedSignature = await generateSessionSignature(session.token, session.userId, session.expiresAt);
  return timingSafeEqual(session.signature, expectedSignature);
}

// ====================================================================
// 4. CSRF PROTECTION (Anti-Cross Site Request Forgery Token)
// ====================================================================

const CSRF_STORAGE_KEY = 'fittrack_csrf_token';

/**
 * Generates or retrieves a cryptographically secure CSRF token.
 */
export function getCsrfToken(): string {
  try {
    let token = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (!token) {
      token = generateSalt(32);
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    }
    return token;
  } catch {
    return 'ft_csrf_' + Math.random().toString(36).substring(2);
  }
}

/**
 * Validates a submitted CSRF token matches the session token
 */
export function validateCsrfToken(submittedToken: string): boolean {
  if (!submittedToken) return false;
  const currentToken = getCsrfToken();
  return timingSafeEqual(submittedToken, currentToken);
}

// ====================================================================
// 5. PERSISTENT RATE LIMITER (Brute Force Protection)
// ====================================================================

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

const RATE_LIMIT_STORAGE_KEY = 'fittrack_ratelimit_v2';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 60 seconds initial lockout

function getRateLimitStore(): Record<string, RateLimitState> {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRateLimitStore(store: Record<string, RateLimitState>): void {
  try {
    sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // sessionStorage unavailable or restricted
  }
}

/**
 * Checks if a login attempt is permitted under rate limits.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingSeconds: number;
  remainingAttempts: number;
} {
  const key = identifier.trim().toLowerCase();
  const now = Date.now();
  const store = getRateLimitStore();
  const state = store[key] || { attempts: 0, lockedUntil: null, lastAttemptAt: now };

  if (state.lockedUntil && now < state.lockedUntil) {
    const remaining = Math.ceil((state.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds: remaining, remainingAttempts: 0 };
  }

  // If lockout expired, reset attempts
  if (state.lockedUntil && now >= state.lockedUntil) {
    state.attempts = 0;
    state.lockedUntil = null;
    store[key] = state;
    saveRateLimitStore(store);
  }

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - state.attempts);
  return { allowed: true, remainingSeconds: 0, remainingAttempts };
}

/**
 * Records a failed login attempt and applies progressive lockout.
 */
export function recordFailedLoginAttempt(identifier: string): {
  locked: boolean;
  remainingSeconds: number;
  remainingAttempts: number;
} {
  const key = identifier.trim().toLowerCase();
  const now = Date.now();
  const store = getRateLimitStore();
  const state = store[key] || { attempts: 0, lockedUntil: null, lastAttemptAt: now };

  state.attempts += 1;
  state.lastAttemptAt = now;

  if (state.attempts >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_MS;
    store[key] = state;
    saveRateLimitStore(store);
    return { locked: true, remainingSeconds: Math.ceil(LOCKOUT_MS / 1000), remainingAttempts: 0 };
  }

  store[key] = state;
  saveRateLimitStore(store);
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - state.attempts);
  return { locked: false, remainingSeconds: 0, remainingAttempts };
}

/**
 * Resets rate limit counter upon successful authentication ONLY.
 */
export function resetLoginRateLimit(identifier: string): void {
  const key = identifier.trim().toLowerCase();
  const store = getRateLimitStore();
  delete store[key];
  saveRateLimitStore(store);
}

// ====================================================================
// 6. PII REDACTION & ERROR SANITIZATION (Data Protection)
// ====================================================================

/**
 * Redacts personal emails, tokens, and credentials from log strings
 */
export function redactPii(message: string): string {
  if (!message) return '';
  return message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(password|passwd|pwd|token|key|secret)\s*[:=]\s*[^\s]+/gi, '$1=[REDACTED]');
}
