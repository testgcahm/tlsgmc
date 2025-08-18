import { NextResponse } from 'next/server';
import { getDriveClient } from '@/lib/googleDriveOAuth';

export async function GET() {
  try {
  const drive = await getDriveClient();
    // TODO: Replace with your actual folder ID
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_EVENTS_ID || '';
    if (!folderId) {
      console.error('GOOGLE_DRIVE_IMAGES_FOLDER_ID is missing');
      return NextResponse.json({ success: false, error: 'Google Drive folder ID not set in environment' }, { status: 500 });
    }
  const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      // Include size field to get file sizes
      fields: 'files(id, name, mimeType, size)',
      pageSize: 50,
    });
    
    const files = res.data.files || [];
    
    // Process files with size information
    const images = files.map(file => {
      // Convert size to KB (Google returns size in bytes)
      const sizeInKB = file.size ? Math.round(parseInt(file.size as string) / 1024) : 0;
      const isOverSizeLimit = sizeInKB > 250;
      
      return {
        id: file.id,
        name: file.name,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
        sizeKB: sizeInKB,
        isOverSizeLimit
      };
    });
    
    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error in /api/drive-images:', error);
    if (error && error.code === 'NO_TOKENS') {
      return NextResponse.json({ success: false, error: 'Google Drive not connected', needConnect: true, connectUrl: error.connectUrl }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch images';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
