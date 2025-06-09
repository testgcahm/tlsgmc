import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === '/events' && searchParams.has('event')) {
    const event = searchParams.get('event');
    if (event) {
      return NextResponse.redirect(new URL(`/events/${event}`, request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/events'],
};
