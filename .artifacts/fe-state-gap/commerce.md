# FE state-coverage gaps — COMMERCE cluster

Maps FE rendering against the BE state SSOT (`transactions`, `installment-plan`,
`rewards`, `loyalty`). Every finding was verified in the FE source, not inferred.

### Summary

| Severity | Count |
| --- | --- |
| high | 3 |
| med | 4 |
| low | 4 |

- **high**: checkout/sepay never renders the `Unpaid`/expired terminal states (dead-end wait); minted vouchers are unreachable at checkout (whole redeem→apply loop broken); voucher-modifier rejection has no handling if/when wired.
- **Verified OK (no gap)**: installment+USD combo is correctly prevented (FE forces VND when a term is chosen — matches the BE capability gate); loyalty pricing is rendered faithfully everywhere (single preview source).

---

## checkout/sepay

Route: `src/app/[locale]/checkout/sepay/page.tsx` → `src/components/features/checkout/SepayCheckout/`.
BE domain: `transactions` (states `Pending → Succeeded` | `Pending → Unpaid`).

The page's ONLY signal is `useQueryCourseEnrollmentStatusSwr` polled every 5s
(`SepayCheckout/index.tsx:54-74`). That query returns `isEnrolled` only
(`useQueryCourseEnrollmentStatusSwr.ts:31-32`) — a boolean that can only ever flip
`false → true`. There is no transaction-status query wired anywhere.

1. **Missing state — `Unpaid` (terminal non-paid).** `severity: high` — `SepayCheckout/index.tsx:97-108`.
   BE moves `Pending → Unpaid` when the gateway reports cancelled/expired/voided or
   the reconcile poll budget is exhausted (`transactions/business.md` "Pending → Unpaid").
   The FE has no branch for it: the buyer sits on the QR + an indefinite "waiting for
   payment" spinner (`QrPanel/index.tsx:71-77`) forever. Fix: add a transaction-status
   poll (or surface the reconcile result) and render a terminal "payment not completed /
   expired — start over" state with a retry-checkout CTA.

2. **Missing state — stale-checkout expiry.** `severity: med` — `SepayCheckout/index.tsx:47-108`.
   Invariant #4 (`timeSinceCreationMs` / `TransactionExpiredError`): a checkout goes stale
   after its window. FE shows the same live QR regardless of age, with no "this QR expired"
   branch. Fix: track checkout age (the `ref`/`amount` come from query params) and flip to
   an expired state prompting a fresh checkout.

3. **Render-wrong — success inferred from enrollment, not the transaction.** `severity: low` — `SepayCheckout/index.tsx:58,79-99`.
   Success is derived from `isEnrolled`, a downstream side-effect of `Succeeded`. It is a
   workable proxy for the happy path, but because the failure terminals (#1/#2) are never
   observed, the whole surface is a one-way street: it can only ever show "waiting" or
   "success". The poll `setInterval` also keeps running after the redirect timer is armed
   (harmless, but it never clears on `isEnrolled`).

Note: `SepayCheckout` is single-course oriented (reads `courseId` from params) — a
multi-course cart order (`course: null`, `TransactionItemEntity` lines per
`transactions/business.md`) has no dedicated post-gateway status surface here either.

---

## cart

Route: `src/app/[locale]/cart/page.tsx` → `src/components/features/cart/CartView/`.
Checkout is launched via the shared `PaymentModal` (`src/components/modals/PaymentModal/`).
BE domains: `transactions` (capability matrix), `loyalty` (bundle/progressive pricing).

4. **API-shape (a) — the voucher modifier is entirely unreachable; no rejected-modifier handling.** `severity: high` — `PaymentModal/index.tsx:294-400`, `CartView/index.tsx` (no voucher UI).
   `CourseEnrollRequest.voucherCode` exists in the type (`mutations/types/course-enroll.ts:29`)
   but **no mutation trigger anywhere passes it** (verified: the four `.trigger({…})` calls in
   `PaymentModal/index.tsx:305,349,365,378` never include `voucherCode`; grep across `hooks/` +
   `components/` finds zero call-sites). Consequences:
   - The Coin-shop voucher loop is a **dead end**: `RewardCatalog` mints a "10% off course"
     voucher (`RewardCatalog/index.tsx:132-134`) and `MyVouchers` lists it as `unused`
     (`MyVouchers/index.tsx:124-129`), but there is no field in cart or the payment modal to
     apply it. The `reserved` voucher state (BE: claimed by an in-flight checkout,
     `rewards/business.md`) is therefore unreachable through any FE path.
   - The capability-matrix risk the prompt asked about (offering a combo the server now
     rejects) is currently avoided only by omission — the FE offers no voucher at all.
   - Latent: when voucher IS wired, `PaymentModal` has no per-gateway gating (Flat voucher on
     USD gateways is `rejected` per the matrix) and no typed rejected-modifier branch — the
     generic `runGraphQL` error path (`PaymentModal/index.tsx:392-396`) would dump the raw BE
     English exception. Fix direction: add a voucher input gated by `activeCurrency`/gateway
     capability (hide Flat vouchers on USD, hide all vouchers where unsupported), and handle
     the typed rejection code the way `COURSE_ALREADY_ENROLLED_CODE` is special-cased
     (`PaymentModal/index.tsx:39,324-344`).

5. **API-shape (b) — enroll/checkout rejection surfaces only as a raw English toast.** `severity: med` — `PaymentModal/index.tsx:301-346,392-396`.
   The BE now loud-rejects invalid installment/voucher **before** creating any row
   (`course-enroll.handler.ts:86`, per `transactions/business.md` #6 &
   `installment-plan/business.md`). The FE special-cases exactly ONE code
   (`COURSE_ALREADY_ENROLLED_CODE`, `:39`); every other typed rejection falls through to the
   generic `showErrorToast` and renders the backend's untranslated exception string. Fix:
   detect the modifier-rejection extension code and show a localized, actionable message.

6. **Verified OK — installment+USD is correctly prevented (no gap).** `PaymentModal/index.tsx:226-237`.
   Choosing a term sets `installmentActive`, which forces `hasUsd = false` and clamps
   `activeCurrency` to VND, so the USD (Stripe/PayPal/Crypto) group is never shown while an
   installment term is selected. This matches the BE gate (`course-enroll.handler.ts:86`,
   `installment-plan/business.md`: "USD gateways rejected loudly"). Recorded for completeness
   since the prompt asked; nothing to fix.

7. **Render — cart preview carries no voucher, consistent with BE.** `severity: low` (informational) — `CartView/index.tsx:95-118`.
   Cart pricing is driven by `coursesCheckoutPreview` (loyalty + bundle bonus) with no
   voucher field — which matches the BE note that cart checkout "has no `voucherCode` field
   at all". So the cart does not falsely offer a voucher. Revalidate-on-mount is correctly
   wired (`:103`). No defect; flagged only as the counterpart to #4.

---

## courses  &  courses/[courseId]

Routes: `src/app/[locale]/courses/page.tsx` → `CourseCatalog/`;
`courses/[courseId]/page.tsx` → `CourseDetail/`. BE domain: `loyalty` (pure derived pricing).

8. **Verified OK — loyalty rendered faithfully.** `CoursePricingRail/index.tsx:56-101`, `CatalogCourseCard` (`:30-35`).
   Both surfaces read the same `useQueryCoursePricePreviewSwr` the payment modal uses, skeleton
   the price line while the preview is pending (avoids flashing the pre-loyalty phase price,
   `CoursePricingRail/index.tsx:62-64`), and show the discounted price only when
   `discountPercent > 0`. This honours `loyalty/business.md` invariant #2 ("shown == charged").
   No missing/invented state found on these pages.

---

## rewards

Route: `src/app/[locale]/rewards/page.tsx` → `RewardsPage/` (`RewardCatalog` + `MyVouchers`).
BE domains: `rewards` (redemption + voucher lifecycles), `loyalty`.

9. **Verified OK — redemption + voucher states rendered.** `RewardCatalog/index.tsx:251-305`, `MyVouchers/index.tsx:26-31,124-129`.
   Catalog handles affordable/insufficient (`cannotAfford` disabled, `:302-304`), loading,
   empty, error, and an irreversible-spend confirm modal (`:383-417`) — matching the BE
   pessimistic-locked redeem. `MyVouchers` renders all four voucher display states
   (`unused/reserved/used/expired` via `STATUS_COLOR`) and generic redemption status. No
   invented state.

10. **Render — `reserved` voucher state is unreachable via FE.** `severity: low` — `MyVouchers/index.tsx:26-31`.
    The BE only sets a voucher `Reserved` during an in-flight checkout that reserves it
    (`rewards/business.md`). Because no FE checkout applies a voucher (see #4), a user will
    never see the `reserved` chip in practice. The rendering is correct; the gap is upstream
    (#4). No separate fix — resolves when #4 is wired.

---

## profile/settings/installments

Route: `src/app/[locale]/profile/settings/installments/page.tsx` → `profile/InstallmentPlans/`.
BE domain: `installment-plan` (`Active → Overdue → Defaulted`; `→ Completed`).

11. **Render-under — `Overdue` shows no urgency / lockout countdown.** `severity: med` — `InstallmentPlans/index.tsx:170-256`.
    BE `Overdue` runs a 3-stage clock (`secondReminderAfterDays=7`, `lockoutAfterDays=14` →
    `Defaulted` + course lock, `installment-plan/business.md`). FE renders `Overdue` as just an
    amber `Chip` (`:176-182`) with the same pay button — only `Defaulted` gets an alerting
    `Callout` (`:250-256`). A user one payment away from losing course access sees nothing
    conveying the deadline. Fix: add an `Overdue` warning Callout with the `nextDueAt` /
    days-until-lockout, distinct from the neutral chip.

12. **Render — no revalidate after returning from the gateway.** `severity: low` — `InstallmentPlans/index.tsx` (no mount `refresh`, cf. `CartView/index.tsx:103`).
    After `onPay` redirects to PayOS and the user returns, the list is not force-refreshed
    (unlike the cart). Plan advancement is async (only on tx confirm), so some staleness is
    inherent and SWR focus-revalidation mitigates it — but a stale `installmentsPaid` /
    `nextDueAt` can persist. Fix: add a mount-refresh, mirroring `CartView`.

13. **Render — `Completed` plans silently vanish.** `severity: low` — `my-installment-plans.ts:46-48`, `InstallmentPlans/index.tsx:78`.
    The query returns "non-completed" plans only (by BE design), so a plan that completes
    while viewing just disappears from the list on next fetch with no "paid off" confirmation.
    Intended behaviour, not a state contradiction — flagged only as a UX dead-spot; optional
    "recently completed" affordance would close it.
