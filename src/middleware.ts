import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { resolveLocaleFromRequest } from '@/lib/i18n';

const AUTH_PATHS = ['/dashboard', '/auth/'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const path = request.nextUrl.pathname;

  // Geo-based locale for marketing pages (never for couple wedding pages /w/*)
  if (!request.cookies.get('ml_locale')) {
    const country = request.headers.get('x-vercel-ip-country');
    const accept = request.headers.get('accept-language');
    const locale = resolveLocaleFromRequest(country, accept);
    response.cookies.set('ml_locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 180 });
  }

  if (AUTH_PATHS.some(p => path.startsWith(p))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { response.cookies.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { response.cookies.set({ name, value: '', ...options }); },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (path.startsWith('/dashboard') && !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (path.startsWith('/auth/') && user && !path.startsWith('/auth/callback')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  return response;
}

export const config = {
  matcher: ['/', '/templates/:path*', '/pricing', '/blog/:path*', '/city/:path*', '/dashboard/:path*', '/auth/:path*'],
};
