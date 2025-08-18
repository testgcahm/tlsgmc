import { google } from 'googleapis';
import { adminDb } from '@/lib/firebase-admin';

const COLLECTION = 'integrations';
const DOC_ID = 'googleDrive';

export type StoredGoogleTokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
};

function getClientConfig() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET');
  }
  return { clientId, clientSecret };
}

export function getRedirectUri(origin?: string) {
  const envUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (envUri) return envUri;
  if (origin) return `${origin.replace(/\/$/, '')}/api/auth/google/callback`;
  return 'http://localhost:3000/api/auth/google/callback';
}

export function getOAuth2Client(origin?: string) {
  const { clientId, clientSecret } = getClientConfig();
  const redirectUri = getRedirectUri(origin);
  return new (google.auth as any).OAuth2(clientId, clientSecret, redirectUri);
}

export async function getStoredTokens(): Promise<StoredGoogleTokens | null> {
  const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
  if (!doc.exists) return null;
  const data = doc.data() as StoredGoogleTokens | undefined;
  return data ?? null;
}

export async function saveTokens(tokens: StoredGoogleTokens) {
  const existing = await getStoredTokens();
  const merged: StoredGoogleTokens = { ...(existing || {}), ...tokens };
  await adminDb.collection(COLLECTION).doc(DOC_ID).set(merged, { merge: true });
}

export async function getDriveClient(origin?: string) {
  const oauth2Client = getOAuth2Client(origin);
  const tokens = await getStoredTokens();
  if (!tokens || !tokens.refresh_token) {
    const connectUrl = `${origin ?? ''}/api/auth/google/start`;
    const err: any = new Error('Google Drive is not connected. Visit connect URL.');
    err.code = 'NO_TOKENS';
    err.connectUrl = connectUrl;
    throw err;
  }
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: oauth2Client as any });
}

export const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
