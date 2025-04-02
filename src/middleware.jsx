import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Look for Firebase auth token in cookies
  // You need to ensure your Firebase auth setup saves the token to cookies
  const firebaseToken = req.cookies.get('firebaseAuth');
  if(firebaseToken){
    console.log(req.nextUrl.pathname, "here");
    if(req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login/'){
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if(req.nextUrl.pathname==="/profile"){
      return NextResponse.next();
    }
    
  }
  if (firebaseToken && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if(!firebaseToken){
    console.log(req.nextUrl.pathname, "here");
    if(req.nextUrl.pathname === '/login/'){
      return NextResponse.next();
    }
    if(req.nextUrl.pathname !== '/'){
      return NextResponse.redirect(new URL('/login', req.url));
    }
    }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.svg).*)'
  ],
}