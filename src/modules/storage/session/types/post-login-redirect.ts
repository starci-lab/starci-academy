/**
 * Session storage post-login redirect target — stashed before handing off to the
 * Keycloak OAuth round-trip (query params don't reliably survive the IdP hop), then
 * read back by {@link OauthRedirect} once the callback lands.
 */
export interface SessionStoragePostLoginRedirect {
    /** An internal path (e.g. `/dashboard`) to send the user to after a successful login. */
    target: string
}
