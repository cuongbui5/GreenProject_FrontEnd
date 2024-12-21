import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {cookies} from "next/headers";


export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('token');
    const authority = req.cookies.get('Authority');

    if(authority==undefined){
        return NextResponse.redirect(new URL('/auth', req.url));
    }else {
        if (url.pathname.startsWith('/admin') && authority?.value === 'ADMIN') {
            return NextResponse.next();
        } else if (url.pathname.startsWith('/home') && authority?.value === 'USER') {
            return NextResponse.next();
        } else {
            if(authority?.value === 'ADMIN'){
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL('/forbidden', req.url));
        }
    }



}
export const config = {
    matcher: ['/admin/:path*', '/home/:path*'], // Áp dụng cho tất cả các route bắt đầu bằng /admin hoặc /home
};


