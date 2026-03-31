import { withAuth } from 'next-auth/middleware';
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        //Additional checks: premium-only routes, admin-only, etc.
        const url = req.nextUrl.pathname;
        if (url.startsWith("/admin")) {
            const userRole = req.nextauth.token?.role;
            if (userRole !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
        return NextResponse.next();
    },
    {
        callbacks: { authorized: ({ token }) => !!token }
    }
);

export const config = { matcher: ["/dashboard/:path*", "/learn/:path*", "/exam/:path*", "/admin/:path*"] };