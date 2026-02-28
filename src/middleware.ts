import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Since we are using localStorage in the client-side AuthProvider, 
  // middleware might not have access to it. 
  // For a more robust app, we'd use cookies for tokens.
  // But for this prototype, we'll rely on client-side protection within the AuthProvider/Layouts.
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
