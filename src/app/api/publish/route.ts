import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { PublishType } from '@/types/publish';
import { ALLOWED_EMAILS, MERGE_EMAILS } from '@/components/utils';

const merge = false;

const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL + '?buildCache=false';

async function verifyRequest(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Missing or invalid Authorization header' };
    }
    const idToken = authHeader.split('Bearer ')[1];

    const allowedEmails = merge ? MERGE_EMAILS : ALLOWED_EMAILS;

    try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (!decoded.email || !allowedEmails.includes(decoded.email)) {
            return { error: 'Unauthorized: Email not allowed' };
        }
        return { email: decoded.email };
    } catch (err) {
        return { error: 'Invalid or expired token' };
    }
}

async function triggerVercelBuild() {
    if (!VERCEL_DEPLOY_HOOK_URL || process.env.BASE_URL === 'http://localhost:3000/') return;
    try {
        await fetch(VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    } catch (err) {
        // Optionally log error
    }
}

export async function POST(request: Request) {
    const auth = await verifyRequest(request);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    let mode: PublishType = PublishType.Revalidate;
    try {
        const body = await request.json();
        if (body && body.mode === PublishType.Build) {
            mode = PublishType.Build;
        }
    } catch (e) {
        // If no JSON or invalid, default to revalidate
    }

    try {
        if (mode === PublishType.Build) {
            await triggerVercelBuild();
            return NextResponse.json({ success: true, message: 'Vercel build triggered' });
        } else {
            revalidatePath('/events');
            const eventsSnapshot = await adminDb.collection('events').get();
            const eventSlugs = eventsSnapshot.docs.map(doc => doc.data().slug).filter(Boolean);
            for (const slug of eventSlugs) {
                revalidatePath(`/events/${slug}`);
            }
            return NextResponse.json({ success: true, message: 'Revalidation Successful' });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to process publish request' }, { status: 500 });
    }
}