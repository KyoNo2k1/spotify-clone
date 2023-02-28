// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export const middleware =async (request: NextRequest) => {
  //if user is logged in, token available
  const token = await getToken({req : request, secret: process.env.NEXTAUTH_SECRET})
const {pathname} = request.nextUrl
    //if token exists or
    //or NextAuth session & provider,
    //or request to '/_next/' (/_next/static/)
    //allow request
    if (token || pathname.includes('/api/auth') || pathname.includes('/_next')){
        if(pathname === '/login'){
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }
    //Redirect to login if 1.User doesnt have token and 2. is requesting protected route
    if (!token && pathname !== '/login'){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}