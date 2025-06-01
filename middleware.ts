import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow all static files, manifest, icons, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icon-') ||
    pathname.startsWith('/apple-icon-')
  ) {
    return NextResponse.next();
  }
  // Add your protected route logic here if needed
  return NextResponse.next();
} 