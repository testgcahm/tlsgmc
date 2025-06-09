import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { FolderType } from '@/types/googleDrive';
import { revalidatePath } from 'next/cache';

function errorResponse(error: string, status = 500, details?: unknown) {
    console.error(error, details ?? '');
    return NextResponse.json({ success: false, error, details }, { status });
}

export async function POST(req: NextRequest) {
    try {
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch (err: unknown) {
            return errorResponse('Invalid form data', 400, err);
        }

        const file = formData.get('image');
        if (!(file instanceof File)) {
            return errorResponse('No file uploaded or invalid file type', 400);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return errorResponse('Invalid file type', 400);
        }
        if (file.size > 250 * 1024) {
            return errorResponse('File too large (max 250KB)', 400);
        }

        // Google Drive Auth with Service Account from ENV
        const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
        if (!serviceAccountJson) {
            return errorResponse('Google service account credentials not set in environment', 500);
        }
        let credentials;
        try {
            credentials = JSON.parse(serviceAccountJson);
        } catch (err: unknown) {
            return errorResponse('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format', 500, err);
        }
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = google.drive({ version: 'v3', auth });

        const folderType = formData.get('folderType');
        let folderId: string | undefined;
        if (folderType === FolderType.Register) {
            folderId = process.env.GOOGLE_DRIVE_FOLDER_REGISTER_ID;
        } else if (folderType === FolderType.Events) {
            folderId = process.env.GOOGLE_DRIVE_FOLDER_EVENTS_ID;
        } else {
            // fallback to previous logic if not specified
            folderId = ''
        }

        // Read file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Google Drive
        let driveRes;
        try {
            driveRes = await drive.files.create({
                requestBody: {
                    name: file.name,
                    mimeType: file.type,
                    parents: folderId ? [folderId] : undefined,
                },
                media: {
                    mimeType: file.type,
                    body: Readable.from(buffer),
                },
                fields: 'id',
            });
        } catch (err: unknown) {
            return errorResponse('Failed to upload to Google Drive', 502, err);
        }
        const fileId = driveRes.data.id;
        if (!fileId) {
            return errorResponse('Google Drive upload failed', 500, driveRes.data);
        }

        // Make file public
        try {
            await drive.permissions.create({
                fileId,
                requestBody: { role: 'reader', type: 'anyone' },
            });
        } catch (err: unknown) {
            // Not fatal, but log
            console.error('Failed to set file public', err);
        }
        const url = folderType === FolderType.Events ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : `https://drive.google.com/uc?id=${fileId}`;
        
        folderType === FolderType.Events && revalidatePath('/admin');

        return NextResponse.json({ success: true, url });

    } catch (err: unknown) {
        return errorResponse('Unexpected server error', 500, err);
    }
}
