import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { ALLOWED_EMAILS, MERGE_EMAILS } from '@/components/utils';

const merge = false;

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

export async function GET() {
  try {
    // Fetch all documents from the 'events' collection
    const eventsCol = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCol);
    const eventsArray = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Always return a valid response, even if no events exist
    return NextResponse.json({ eventsArray: eventsArray || [] });
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array on error to prevent build failures
    return NextResponse.json({ eventsArray: [] });
  }
}

export async function POST(request: Request) {
  const auth = await verifyRequest(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }
  try {
    const data = await request.json();
    const docRef = await adminDb.collection('events').add(data);
    
    // Always revalidate the main events page
    revalidatePath('/events');
    
    // Only revalidate the specific event page if slug exists
    if (data.slug) {
      revalidatePath(`/events/${data.slug}`);
    }
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const auth = await verifyRequest(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }
  try {
    const body = await request.json();
    
    // Always revalidate the main events page
    revalidatePath('/events');
    
    if (Array.isArray(body.order)) {
      const batch = adminDb.batch();
      body.order.forEach((item: { id: string, order: number }) => {
        const eventRef = adminDb.collection('events').doc(item.id);
        batch.update(eventRef, { order: item.order });
      });
      await batch.commit();
      
      // For reordering, we only need to revalidate the main events page which contains all events
      // No need to revalidate individual pages as only the order changed
      
      return NextResponse.json({ success: true });
    } else {
      const { id, ...data } = body;
      if (!id) return NextResponse.json({ success: false, error: 'Missing event id' }, { status: 400 });
      
      // Get the current event data to check if slug has changed
      const eventRef = adminDb.collection('events').doc(id);
      const eventDoc = await eventRef.get();
      const oldData = eventDoc.data();
      
      await eventRef.update(data);
      
      // If the event has a slug, revalidate its page
      if (data.slug) {
        revalidatePath(`/events/${data.slug}`);
      }
      
      // If slug was changed, also revalidate the old slug page
      if (oldData?.slug && data.slug && oldData.slug !== data.slug) {
        revalidatePath(`/events/${oldData.slug}`);
      }
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const auth = await verifyRequest(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing event id' }, { status: 400 });
    
    // Get the event data before deleting to get the slug
    const eventRef = adminDb.collection('events').doc(id);
    const eventDoc = await eventRef.get();
    const eventData = eventDoc.data();
    
    // Revalidate the specific event page if slug exists before deleting
    if (eventData?.slug) {
      revalidatePath(`/events/${eventData.slug}`);
    }
    
    await eventRef.delete();
    
    // Always revalidate the main events page
    revalidatePath('/events');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
