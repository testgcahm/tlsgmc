import { NextResponse } from 'next/server';
import { getOAuth2Client, DRIVE_SCOPES, getRedirectUri } from '@/lib/googleDriveOAuth';

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const oauth2Client = getOAuth2Client(origin);
    const redirectUri = getRedirectUri(origin);
    const state = process.env.GOOGLE_OAUTH_STATE;
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: DRIVE_SCOPES,
      prompt: 'consent',
      redirect_uri: redirectUri,
      state,
    } as any);
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to start OAuth';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
