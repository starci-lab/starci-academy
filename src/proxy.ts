import createMiddleware from "next-intl/middleware"
import {
    NextResponse,
    type NextRequest,
} from "next/server"
import {routing} from "@/i18n/routing"

/** next-intl locale negotiation + redirect middleware. */
const intlMiddleware = createMiddleware(routing)

/**
 * Server-readable "is logged in" signal.
 *
 * The HttpOnly `keycloak_refresh_token` is host-only on the API host, so the FE
 * edge cannot see it. The BE therefore issues a parallel, JS-readable `session_hint`
 * cookie alongside the refresh token — same lifetime, parent-domain scope
 * (`.academy.starci.org`) — so it reaches this FE host. It exists exactly while a
 * refresh session is active. It only decides which shell to show first; the SPA
 * still verifies the real session (token refresh) once the page mounts, so it is
 * never trusted for authorization.
 */
const AUTH_SIGNAL_COOKIE = "session_hint"

/**
 * Matches the marketing root only: `/`, `/vi`, `/en` (with optional trailing
 * slash). These are the paths a logged-in visitor should be bounced away from,
 * GitHub-style. Deeper marketing pages (e.g. `/vi/home`) are intentionally NOT
 * matched, so a signed-in user can still open the landing page on purpose.
 */
const HOME_ROOT_PATH = /^\/(?:(en|vi)\/?)?$/

/**
 * Edge middleware (Next.js 16 `proxy` convention).
 *
 * GitHub-style entry routing: a logged-in visitor hitting the marketing root is
 * redirected to their dashboard before any HTML renders (zero landing flash).
 * Everything else falls through to the next-intl locale middleware unchanged.
 *
 * @param request - the incoming edge request
 * @returns a redirect to the dashboard, or the next-intl response
 */
export default function proxy(request: NextRequest) {
    const {pathname} = request.nextUrl
    const isAuthed = request.cookies.has(AUTH_SIGNAL_COOKIE)
    const homeMatch = pathname.match(HOME_ROOT_PATH)

    if (isAuthed && homeMatch) {
        // preserve the locale already in the URL, else the persisted LOCALE
        // cookie, else the configured default
        const locale = homeMatch[1]
            ?? request.cookies.get("LOCALE")?.value
            ?? routing.defaultLocale
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/dashboard`
        return NextResponse.redirect(url)
    }

    return intlMiddleware(request)
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
