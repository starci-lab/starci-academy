export enum LocalStorageId {
    /** Keycloak access JWT (same key as legacy `ACCESS_TOKEN_STORAGE_KEY`). */
    KeycloakAccessToken = "keycloak:access_token",
    /** Learner has discovered "highlight a passage to ask AI" (hides the one-time hint + "new" tag). */
    HintSeenSelectionAsk = "hint:selection-ask",
    /** Cached mirror of the user's server-saved accent color (hex) — read by a
     *  blocking inline script before hydration so the accent never flashes to
     *  the default brand color on reload. Server (`UserEntity.accentColor`) is
     *  still the source of truth; this is a same-device fast-path cache. */
    AccentColor = "appearance:accent_color",
    /** Cached mirror of the user's server-saved background effect — same
     *  fast-path purpose as {@link AccentColor}, for the ambient background. */
    BackgroundEffect = "appearance:background_effect",
}