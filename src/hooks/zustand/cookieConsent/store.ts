"use client"

import { create } from "zustand"

/** Cookie name persisting the visitor's consent choice (server-readable, scoped to the app). */
const CONSENT_COOKIE = "starci_cookie_consent"
/** Bump to re-prompt every visitor when the cookie categories change. */
const CONSENT_VERSION = 1
/** 180 days — re-ask after this so consent stays fresh (GDPR/PDPD hygiene). */
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

/** Shape stored in the consent cookie. */
interface ConsentCookiePayload {
    /** Cookie schema version. */
    v: number
    /** Whether analytics (Google Analytics) is allowed. Necessary cookies are always on. */
    analytics: boolean
}

/** Read the consent cookie → the allowed-analytics flag, or null when undecided / stale version. */
const readConsentCookie = (): boolean | null => {
    if (typeof document === "undefined") {
        return null
    }
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    if (!match) {
        return null
    }
    try {
        const payload = JSON.parse(decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1))) as ConsentCookiePayload
        if (payload.v !== CONSENT_VERSION) {
            return null
        }
        return Boolean(payload.analytics)
    } catch {
        return null
    }
}

/** Persist the consent choice to the cookie (affirmative action — only written on an explicit choice). */
const writeConsentCookie = (analytics: boolean): void => {
    if (typeof document === "undefined") {
        return
    }
    const payload: ConsentCookiePayload = { v: CONSENT_VERSION, analytics }
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax`
}

/** Cookie-consent store: the committed choice + actions. The modal keeps its OWN draft toggle. */
interface CookieConsentState {
    /**
     * Whether the visitor has made a choice yet.
     * `null` = not hydrated (SSR / first paint), `false` = undecided (show banner), `true` = decided.
     */
    decided: boolean | null
    /** Committed: whether analytics is allowed. */
    analyticsAllowed: boolean
    /** Read the cookie once into state (idempotent — call from the banner / analytics gate on mount). */
    hydrate: () => void
    /** Accept every category. */
    acceptAll: () => void
    /** Reject everything except necessary. */
    rejectAll: () => void
    /** Commit a granular choice (from the preferences modal). */
    save: (analytics: boolean) => void
}

/**
 * Single source of truth for cookie consent. The banner shows when `decided === false`; the analytics
 * gate renders Google Analytics only when `decided && analyticsAllowed`. Scripts stay blocked until the
 * visitor makes an affirmative choice (GDPR / VN PDPD), and the choice persists in {@link CONSENT_COOKIE}.
 */
export const useCookieConsentStore = create<CookieConsentState>((set, get) => ({
    decided: null,
    analyticsAllowed: false,
    hydrate: () => {
        // idempotent: only read the cookie the first time
        if (get().decided !== null) {
            return
        }
        const stored = readConsentCookie()
        if (stored === null) {
            set({ decided: false, analyticsAllowed: false })
            return
        }
        set({ decided: true, analyticsAllowed: stored })
    },
    acceptAll: () => {
        writeConsentCookie(true)
        set({ decided: true, analyticsAllowed: true })
    },
    rejectAll: () => {
        writeConsentCookie(false)
        set({ decided: true, analyticsAllowed: false })
    },
    save: (analytics: boolean) => {
        writeConsentCookie(analytics)
        set({ decided: true, analyticsAllowed: analytics })
    },
}))
