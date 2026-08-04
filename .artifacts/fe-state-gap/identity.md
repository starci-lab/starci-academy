# FE State-Coverage Gaps — IDENTITY cluster

Maps the identity FE routes against the BE state SSOT
(`.artifacts/states/{user,device,guards}/business.md`). Only verified gaps listed.
Line anchors are into `C:/Repositories/starci-academy/src`.

### Summary

| Severity | Count |
|----------|-------|
| High     | 1 |
| Medium   | 3 |
| Low      | 4 |

- **High (1):** Privacy settings clobbers saved section-visibility because `me` never fetches it.
- **Medium (3):** OAuth redirect masks auth failure; 401 token-expiry swallowed by error link; profile `me` header contract.
- **Low (4):** bare-`/profile` infinite-spinner gate; stale route JSDoc on Sessions/Security; CV signed-out; login page has no page-level auth-error surface.

Domains with **no gap** (documented for completeness):
- **`device`** (FingerprintJS anti-cheat `devices` table): BE doc says there is *no* GraphQL surface and no FE screen should exist — and none does. The FE "Sessions" screen is the *separate* `login_sessions` / `platform/session` domain (not the `device` domain) and renders it faithfully. Correct.
- **`guards` profile-visibility / enrollment gates**: `PublicProfile` + `ProfileSectionGuard` mirror the per-viewer lock and section flags correctly (see notes under `/profile/[username]`).

---

## /profile (bare — owner redirect)

File: `src/app/[locale]/profile/page.tsx`

Redirect-only page: reads `state.user.user?.username` (from the required-auth `me`
query) and `router.replace`s to `/profile/<username>`, showing `ProfileLoadingState`
meanwhile.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Low | `profile/page.tsx:34-43` | **Missing error/timeout state.** If `me` fails or is slow, `username` never resolves and the page spins on `ProfileLoadingState` indefinitely — no error/retry branch. BE `me` is required-auth and can fail (guard `UserNotFoundException`, transient 401 on cold load). | Add a settle/timeout → render a retry or bounce to `/login`; don't rely on `username` eventually appearing. |

Route is edge-protected (`proxy.ts` PROTECTED_PATTERNS `/^\/profile(?:$|…)/`), so a
signed-out visitor never reaches it — no signed-out branch needed here.

---

## /profile/[username] (public profile)

Files: `src/app/[locale]/profile/[username]/page.tsx` (server, metadata + JSON-LD),
`…/[username]/layout.tsx` → `PublicProfile` shell,
`components/features/profile/PublicProfile/index.tsx`,
`…/ProfileSectionGuard/index.tsx`.

Faithful to the `user` + `guards` domains:
- **profile locked ↔ unlocked (per-viewer):** `isLocked = Boolean(user?.profileLocked) && !isSelf` → `ProfileLockedState`; owner always passes (`PublicProfile/index.tsx:106-112,147-149`). Mirrors `GraphqlProfileVisibilityGuard` (owner-always, else `ProfileNotVisibleException`).
- **public header not gated:** the `userProfile` header (name/avatar/bio) is fetched for everyone; only sub-sections gate. Matches `user/business.md` §3 ("public `userProfile` header query … deliberately NOT gated").
- **section visibility:** `ProfileSectionGuard` reads `user.sectionVisibility[section]` and fails *open* while loading, with BE as backstop — matches `guards` doc.
- **loading / not-found / locked** branches all present (`PublicProfile/index.tsx:135-149`), with a deliberate hold-during-revalidate to avoid a not-found flash.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Med | `profile/[username]/page.tsx:35-57` | **`me`/viewer-object header contract** — not this page's bug but worth a guard note: `user/business.md` §1 warns that an *optional-auth* viewer object may carry `.id` alone (no username/avatar). Here `isSelf` compares against `state.user.user` from the *required-auth* `me` (fully populated), so it is safe — but any future reuse of an optional-auth viewer for `isSelf` would silently mis-classify the owner as a visitor. | Keep `isSelf` sourced from `me` (required-auth); never derive it from an optional-auth resolver's viewer object. |
| Low | `profile/[username]/page.tsx:120-152` | Server `getProfile` (no-auth, `no-store`) returns null on error and the body still renders `<ProfileOverviewTab/>`, relying on the client shell to re-resolve/404. Double fetch; a server 404 + client success can briefly disagree on metadata vs. body. Cosmetic. | Acceptable; optionally pass the server result down to seed the client SWR cache. |

---

## /profile/cv (CV gallery)

Files: `src/app/[locale]/profile/cv/page.tsx` → `components/features/profile/CV/index.tsx`
→ `CV/CvGallery/index.tsx`.

State handling is solid: `AsyncContent` covers loading (skeleton), empty
(create-first CTA), error (retry), and the loaded grid
(`CvGallery/index.tsx:190-267`). The single-public-CV invariant is honored —
toggling one public refetches the whole set (`:178-188`), matching a BE-enforced
"one public CV per user".

Note: the CV state machine (blocks / AI generate / tailor / public flag) has **no
business.md among the three assigned domains** (`user`/`device`/`guards`), so CV
fidelity is only partially verifiable here. The public-CV visibility is consistent
with the per-viewer profile-visibility model in `user`/`guards`.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Low | `CvGallery/index.tsx:141-234` | **No explicit signed-out state.** `useQueryMyCvBlocksSwr` runs unconditionally; if unauthenticated it 401s into the generic error state ("errorTitle") rather than a "sign in to manage CVs" prompt. Masked in practice because `/profile/cv` is edge-protected (`proxy.ts` `\/cv`). | Low priority given the edge gate; if ever unprotected, add a signed-out branch. |

---

## /profile/settings (settings hub)

File: `components/features/profile/Settings/SettingsHome/index.tsx`.

Static destination grid + a login-method chip derived from
`state.user.user?.authenticationType` (github / google / credentials,
`SettingsHome/index.tsx:56-63`). No data-state machine; no gap.

---

## /profile/settings/privacy (lock + section visibility)

File: `components/features/profile/PrivacySettings/index.tsx`
+ `src/modules/api/graphql/queries/query-me.ts`.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| **High** | `query-me.ts:6-37` + `PrivacySettings/index.tsx:37-44,65-67,71-77,80-103` | **API-shape mismatch → render-wrong + destructive save.** The `me` query does NOT select `sectionVisibility` (it selects `profileLocked` but not the nested visibility object). `PrivacySettings` seeds its four section toggles from `user.sectionVisibility` (redux, populated by `me`), so on a cold page load it is always `undefined` → `seedSectionVisibility` defaults **all four to `true`**. A user who previously hid Projects/Challenges/Skills/Activity sees every toggle back ON, and pressing Save persists `{ sectionVisibility: {all true} }`, silently **un-hiding** sections the BE had marked private. `profileLocked` seeds correctly (it *is* in `me`); only the section group is broken. | Add `sectionVisibility { projects challenges skills activity }` to `query-me.ts` (the public `query-user-profile.ts:31-36` already fetches it — mirror it), so redux `me` carries the real flags before the seed runs. |

The lock ↔ section-group interaction (lock overrides/greys the group) and the
optimistic `dispatch(setUser)` after save are otherwise faithful to the `user` §3
lock semantics.

---

## /profile/settings/security (two-factor / TOTP)

File: `components/features/profile/Security/index.tsx`
+ mutation docs under `src/modules/api/graphql/mutations/`.

Verified **faithful** to the BE two-factor resolvers (`mutations/two-factor/*` —
note: a *separate* module, not in the three assigned domains, but in scope per the
task's "two-factor shape" example):
- State machine complete: disabled → enable → **enrolling** (QR + secret from `setupTwoFactor`) → confirm; enabled → disable-with-code. Loading skeleton, success/error `Callout` all present (`Security/index.tsx:181-344`).
- **Request-wrapper shape correct:** BE `confirmTwoFactor`/`disableTwoFactor` take `@Args("request") { code }`; the FE documents wrap in `request` and the SWR hooks map `arg → request` (`mutation-confirm-two-factor.ts:6-14`, `useMutateConfirmTwoFactorSwr.ts:19-23`). No mismatch.
- **Redux sync after mutation:** `refreshUser()` re-runs `useQueryUserSwr`, whose fetcher dispatches `setUser(me.data)` (`useQueryUserSwr.ts:31-38`), and `me` includes `twoFactorEnabled` (`query-me.ts:23`), so the enabled/disabled chip flips correctly. Not stale.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Low | `Security/index.tsx:340-343` | "Enforcement at login not wired" note — BE `ConfirmTwoFactor` only sets the `twoFactorEnabled` flag; there is **no** BE "2FA-required at login" state. FE and BE agree it is config-only, so this is *consistent*, not a gap. Listed only to confirm no invented "2FA-required" login state exists on the FE. | None — leave as-is until BE adds a challenge step. |
| Low | `Security/index.tsx:168-176,94-115` | `onCancelSetup` clears only local state; a `setupTwoFactor` that minted a pending server-side `twoFactorSecret` (BE `confirmTwoFactor` reads `current.twoFactorSecret`) is left dangling if the user abandons enrollment. Not a render gap, minor hygiene. | Optional: a `cancelSetup`/discard mutation, or let the next `setupTwoFactor` overwrite (likely already does). |

---

## /login

File: `components/features/auth/LoginPage/index.tsx`.

Faithful: `authenticated` → `router.replace(redirect ?? dashboard)`
(`LoginPage/index.tsx:55-60`); the `?redirect=` param is sanitized to internal
paths only (`:39-43`) — good injection guard. `/login` is the documented 401 target
(`guards` doc). Sign-in/sign-up steps are delegated to the shared modal sections.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Low | `LoginPage/index.tsx:62-93` | No page-level auth-error surface (invalid credentials / OTP failure). Delegated entirely to `SignInSection`/`SignUpSection`; acceptable if those render their own error states (not re-verified here). | Confirm the inner sections render credential/OTP error states; otherwise a failed sign-in shows nothing at page level. |

---

## /authentication/github, /authentication/google

Files: `authentication/github/login/page.tsx`, `authentication/google/page.tsx`,
`authentication/google/login/page.tsx` → `components/features/auth/OauthRedirect/index.tsx`.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Med | `OauthRedirect/index.tsx:46-60` | **Missing OAuth-failure state (render-wrong).** The landing waits a fixed ~1s then *unconditionally* `router.push`es onward (stashed target or home) while showing a "signing in / authenticating" message — it never inspects the Keycloak hand-off result or any `error` query param. A failed/cancelled OAuth round-trip (no session established; BE `AbstractKeycloakAuthGuard` created no user row) still shows success chrome and silently drops the user on the home page as if signed in. | Read the OAuth callback outcome (error param / adapter init result) before redirecting; render an explicit "sign-in failed, try again" state instead of always showing the success spinner. |

---

## Cross-cutting — session lifecycle (guards + platform/session)

File: `src/modules/api/graphql/clients/links/error.ts`,
`src/hooks/effects/useSessionSuperseded.ts`.

**Faithful:** the device-limit eviction path is handled end-to-end. BE
`SessionService` enforces `maxDevices` (default 2), evicting the oldest session →
`SessionSupersededException` on its next request; the FE error link matches the
`"superseded"` marker, drops the token, and hard-navigates home, with a deferred
toast (`error.ts:35-48,58-64`; `useSessionSuperseded.ts:12-26`). Good mirror of the
`device`-limit state.

| Sev | Anchor | Gap | Fix direction |
|-----|--------|-----|---------------|
| Med | `error.ts:65-72` | **401 / token-expiry swallowed (missing session-expired transition).** Plain `Unauthorized` / `UNAUTHENTICATED` GraphQL errors (token expired mid-session but *not* superseded, e.g. refresh failed) are only `console.log`ged — no redirect to `/login`, no logged-out transition, no token-refresh trigger. The user is left on a half-authed shell where each query returns an error. `guards` doc frames 401 as "you need to (re)authenticate". | Treat `UNAUTHENTICATED`/`Unauthorized` like superseded: clear the token and bounce to `/login?redirect=…` (or trigger a silent refresh first). |
| Low | `sessions/page.tsx:4-7`, `security/page.tsx:4-7` | **Stale route JSDoc** — the thin route files claim `/profile/sessions` and `/profile/security`, but the actual URLs are `/profile/settings/sessions` and `/profile/settings/security` (that is why they fall under the `\/settings` edge-protect pattern). Doc drift only, no runtime effect. | Update the JSDoc paths to `/profile/settings/…`. |

---

### Verification notes
- Public-profile gating fields (`profileLocked`, `sectionVisibility`) ARE fetched by `query-user-profile.ts:29-36`; the High finding is specific to `query-me.ts` omitting `sectionVisibility`.
- 2FA request-wrapper and redux-sync were checked against BE resolvers (`confirm-two-factor.resolver.ts`, request `{ code }`) and the FE mutation docs/SWR hooks — no shape mismatch.
- The `device` domain (fingerprint anti-cheat) has no FE surface by design; the FE Sessions screen is the distinct `login_sessions` domain and is faithful.
