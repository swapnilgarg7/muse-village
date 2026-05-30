import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const firebaseToken = request.cookies.get("firebaseAuth");

    const isDonate = pathname === "/donate" || pathname === "/donate/";
    const isPublic = pathname === "/" || pathname === "/login" || pathname === "/login/" || isDonate;

    if (isPublic) {
        if (firebaseToken && !isDonate) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    if (!firebaseToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
};
