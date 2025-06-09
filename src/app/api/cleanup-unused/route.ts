import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { EventData } from '@/components/events/types';
import { revalidatePath } from 'next/cache';

// Helper to get all event and subevent image IDs in use
async function getUsedImageIds(): Promise<Set<string>> {
  const snapshot = await adminDb.collection('events').get();
  const usedIds = new Set<string>();
  snapshot.forEach(doc => {
    const data = doc.data() as EventData;
    // Main event image
    if (data.image) {
      const match = data.image.match(/id=([\w-]+)/);
      if (match) usedIds.add(match[1]);
    }
    // Subevent images
    if (Array.isArray(data.subevents)) {
      (data.subevents as { imageUrl?: string }[]).forEach(sub => {
        if (sub.imageUrl) {
          const match = sub.imageUrl.match(/id=([\w-]+)/);
          if (match) usedIds.add(match[1]);
        }
      });
    }
  });
  return usedIds;
}

// Helper to get all images in the Drive folder
async function getDriveImages(auth: any, folderId: string) {
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id, name, mimeType, size)',
    pageSize: 100,
  });
  // Only return files with a valid id
  return (res.data.files || []).filter(f => typeof f.id === 'string');
}

export async function POST(request: Request) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return NextResponse.json({ success: false, error: 'Google service account credentials not set in environment' }, { status: 500 });
    }
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const client = await auth.getClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_EVENTS_ID || '';
    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Google Drive folder ID not set in environment' }, { status: 500 });
    }
    const usedIds = await getUsedImageIds();
    const driveImages = await getDriveImages(client, folderId);
    // Only consider images with a valid id
    const unused = driveImages.filter(img => img.id && !usedIds.has(img.id));
    // Delete unused images
    const drive = google.drive({ version: 'v3', auth: client as any });
    let deleted: string[] = [];
    for (const img of unused) {
      try {
        if (typeof img.id === 'string') {
          await drive.files.delete({ fileId: img.id });
          deleted.push(typeof img.name === 'string' ? img.name : img.id);
        }
      } catch (e) {
        console.error('Failed to delete image', img.id, e);
        // Ignore errors for individual files
      }
    }
    revalidatePath('/admin');
    return NextResponse.json({ success: true, deleted, count: deleted.length });
  } catch (error) {
    console.error('Cleanup unused images error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
