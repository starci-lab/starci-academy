import type Keycloak from "keycloak-js"
/**
 * Public Keycloak facades re-exported from the runtime instance.
 * `login` / `logout` / `init` are the same as `keycloak-js` instance methods;
 * `init` is wrapped so token/auth state stays in sync with React.
 */
export type KeycloakClientAdapter = {
    /** True when the Keycloak client has a logged-in session. */
    authenticated: boolean
    /** Access token, if a session is active. */
    token: string | undefined
    /**
     * Refreshes the token if it expires within `minValiditySeconds`.
     * @param minValiditySeconds - Seconds of validity the token should still have
     * @returns Whether a refresh was performed
     */
    updateToken: (minValiditySeconds: number) => Promise<boolean>
    /** @see `keycloak-js` {@linkcode Keycloak#login} */
    login: Keycloak["login"]
    /** @see `keycloak-js` {@linkcode Keycloak#logout} */
    logout: Keycloak["logout"]
    /**
     * Initializes (or re-initializes) the client; used after the first
     * `check-sso` run, e.g. to apply tokens from the backend ROPC login.
     * @param initOptions - keycloak-js init options
     * @returns Whether the user is authenticated after init
     */
    init: Keycloak["init"]
}
