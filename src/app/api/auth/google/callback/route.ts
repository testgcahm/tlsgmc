import { NextResponse } from 'next/server';
import { getOAuth2Client, saveTokens, getRedirectUri } from '@/lib/googleDriveOAuth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const origin = url.origin;
  if (!code) {
    return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 });
  }
  if (process.env.GOOGLE_OAUTH_STATE && state !== process.env.GOOGLE_OAUTH_STATE) {
    return NextResponse.json({ success: false, error: 'Invalid state' }, { status: 400 });
  }
  try {
    const oauth2Client = getOAuth2Client(origin);
    const redirectUri = getRedirectUri(origin);
    const { tokens } = await oauth2Client.getToken({ code, redirect_uri: redirectUri } as any);
    await saveTokens(tokens as any);
    const message = 'Google Drive connected successfully. You can close this window.';
    return new NextResponse(`<html><body>${message}</body></html>`, { headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to complete OAuth';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
