import { NextRequest, NextResponse } from 'next/server';
import { corsAllowedOrigins, corsAllowedMethods, corsAllowedHeaders, corsAllowCredentials } from '@/lib/config';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const method = request.method;

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      // Set CORS headers
      if (origin && isOriginAllowed(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }
      
      response.headers.set('Access-Control-Allow-Methods', corsAllowedMethods.join(','));
      response.headers.set('Access-Control-Allow-Headers', corsAllowedHeaders.join(','));
      
      if (corsAllowCredentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      response.headers.set('Access-Control-Max-Age', '86400');
      
      return response;
    }

    // Handle actual API requests
    const response = NextResponse.next();
    
    if (origin && isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    if (corsAllowCredentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  }

  // For non-API routes, just continue
  return NextResponse.next();
}

function isOriginAllowed(origin: string): boolean {
  // If wildcard is allowed, accept any origin for development
  if (corsAllowedOrigins.includes('*')) {
    return true;
  }
  
  // Check if the exact origin is in the allowed list
  if (corsAllowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check if the origin matches any network ranges
  const url = new URL(origin);
  const hostname = url.hostname;
  
  // Check for localhost variations
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }
  
  // Check for private network IP ranges
  const ipParts = hostname.split('.').map(Number);
  if (ipParts.length === 4) {
    // 192.168.x.x
    if (ipParts[0] === 192 && ipParts[1] === 168) {
      return true;
    }
    // 10.x.x.x
    if (ipParts[0] === 10) {
      return true;
    }
    // 172.16-31.x.x
    if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) {
      return true;
    }
  }
  
  return false;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 