import React from "react"
import { BuildingsIcon, LockIcon } from "@phosphor-icons/react"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Typography, type TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ConsultantProfileBody`: the full DETAIL content of one consultant's
 * profile — photo, name+role, a pressable company row, the full bio, and a
 * fork on the way out: real contact links once unlocked, or a locked callout
 * with a way to unlock them.
 *
 * ⭐ THE DETAIL SIBLING OF `ConsultantCard`, NOT A COPY. `ConsultantCard`'s own
 * file header named this exact gap ("tomorrow's not-yet-built profile
 * overlay") — same `Consultant` entity, two different jobs: the card is a
 * directory TILE (whole card presses to open), this block is what fills the
 * profile once it IS open. That is why the shapes genuinely differ instead of
 * one importing the other:
 *   • `ConsultantCard`'s company row is PLAIN TEXT (a fact inside an already-
 *     pressable card — a second control there would be unreachable/need the
 *     stretched-link pattern for a fact with no action of its own).
 *   • Here the company row is a real `Button` (`onOpenCompany`) — the whole
 *     card press is spent, so opening the company is its own, reachable,
 *     press target.
 *   • `ConsultantCard` clamps the bio to 2 lines (a directory tile teaser);
 *     this block renders it in full — a profile IS the place to read it all.
 *
 * ⭐ JUDGMENT CALL — CONTACT FORK REUSES `FeedbackCallout`, not a hand-rolled
 * `Alert` + `Button` pair, same precedent `TaskLockedAlert`/`CourseTeamGate`
 * already set: `FeedbackCallout` already IS "a status alert + one CTA button
 * it builds and skins itself" (composites/feedback/Feedback). Rebuilding that
 * pair from bare atoms here would be the exact `ContentTabBar` mistake this
 * run exists to correct.
 *
 * ⭐ JUDGMENT CALL — CONTACT LINKS CARRY NO CALLBACK OF THEIR OWN. The task
 * brief gives this block exactly two callbacks (`onOpenCompany`, `onImproveCv`)
 * — there is no per-link `onPress` in the contract. So `contactLinks` are
 * plain navigable data (`href`, e.g. `mailto:`/`tel:`/`https:`) rendered with
 * `Typography`'s own `isLink` + `href` — the atom already knows how to be a
 * link; a `Button` (which has no `href`) would have forced a callback array
 * this block was never given. `onOpenCompany` stays separate because a
 * company is an ENTITY the caller navigates to (not a URL this block holds).
 *
 * ⭐ JUDGMENT CALL — ONE LEAF, `contactUnlocked` IS A STATE. Same precedent as
 * `FoundationModal`'s `kind` switch (cited in the task brief): the composed
 * outer frame (photo → identity → bio → contact area) never changes shape —
 * only WHICH content fills the last slot changes, so this is a state of the
 * `Default` leaf, not two leaves.
 *
 * ⭐ JUDGMENT CALL — DURING `isSkeleton`, THE CONTACT FORK ITSELF SHIMMERS
 * NEUTRALLY rather than picking either branch. `contactUnlocked` is business
 * data the caller does not have yet while loading — rendering the locked
 * callout OR the real links would assert an answer this block does not know,
 * the same reasoning `ConsultantCard`'s header gives for shimmering every
 * optional row instead of guessing which ones the real data will have.
 *
 * ⭐ JUDGMENT CALL — LOCKED CALLOUT'S TITLE/DESCRIPTION ARE BLOCK-OWNED TEXT
 * (§14d.1), not props. The task brief hands this block exactly `consultant` +
 * two callbacks — no text prop for the locked message — so the copy is chrome
 * this block owns outright, same move `TaskLockedAlert` makes for its fixed
 * title.
 *
 * ⚠️ `Image` has no `anatPart` prop of its own (only `showAnatomy`), same gap
 * `ConsultantCard`'s header notes — wrapped in a plain `<div data-anat-part>`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One way to reach this consultant once contact is unlocked — plain navigable data. */
export interface ConsultantProfileBodyContactLink {
    /** Stable React key. */
    key: string
    /** Display label, e.g. "hoa.nguyen@techcorp.vn" or "090 123 4567". */
    label: string
    /** Where the link goes — `mailto:`/`tel:`/`https:` etc. The atom renders it, never fetches it. */
    href: string
    /** Optional leading glyph (mail/phone/chat) as a COMPONENT, not JSX. */
    icon?: TypographyIcon
}

/** One consultant's full profile — plain data, the block builds the detail view from it. */
export interface ConsultantProfileBodyConsultant {
    /** Full name — the profile's accessible heading. */
    fullName: string
    /** Role/title at their company. Row disappears when absent. */
    jobTitle?: string
    /** Company name. The company row disappears when absent. */
    companyTitle?: string
    /** Full bio — rendered in full here, unlike `ConsultantCard`'s clamped teaser. */
    description?: string
    /** Photo URL. Empty/missing → `Image`'s own fallback glyph, never a blank frame. */
    avatarUrl?: string
    /** `true` → real `contactLinks` are shown. `false` → the locked callout is shown instead. */
    contactUnlocked: boolean
    /** Ways to reach this consultant. Only read when `contactUnlocked` is `true`. */
    contactLinks?: Array<ConsultantProfileBodyContactLink>
}

/** Props for {@link ConsultantProfileBody}. */
export interface ConsultantProfileBodyProps {
    /** The consultant whose profile this fills. */
    consultant: ConsultantProfileBodyConsultant
    /** Fired when the visitor presses the company row. Row is disabled without it. */
    onOpenCompany?: () => void
    /** Fired from the locked callout's CTA. No CTA renders without it. */
    onImproveCv?: () => void
    /**
     * `true` → `Image` and every `Typography` line switch to their own shimmer, the
     * company button is disabled, and the contact fork shows a neutral shimmer
     * instead of picking a branch (see file header). There is no id to open yet.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Fixed copy for the locked-contact callout — block-owned wording (§14d.1), see file header. */
const LOCKED_TITLE = "Liên hệ đang bị khoá"
const LOCKED_DESCRIPTION = "Cải thiện CV của bạn để mở khoá thông tin liên hệ của chuyên gia này."
const LOCKED_CTA_LABEL = "Cải thiện CV"

/**
 * The full profile-detail content for one consultant. See the file header for
 * the full contract, the fork between `ConsultantCard`'s tile shape and this
 * one, and the judgment calls behind the contact fork.
 *
 * @param props - {@link ConsultantProfileBodyProps}
 */
const ConsultantProfileBody = ({
    consultant,
    onOpenCompany,
    onImproveCv,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ConsultantProfileBodyProps) => {
    const { fullName, jobTitle, companyTitle, description, avatarUrl, contactUnlocked, contactLinks } = consultant

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                {/* identity: centered photo, name+role, pressable company row */}
                <StackV gap="grouped" align="center" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                    <div data-anat-part={showAnatomy ? "Image" : undefined}>
                        <Image
                            src={avatarUrl}
                            alt={fullName}
                            ratio="square"
                            radius="full"
                            className="w-28"
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    </div>
                    <StackV gap="flush" align="center" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                        <Typography
                            size="h4"
                            weight="bold"
                            align="center"
                            isSkeleton={isSkeleton}
                            text={fullName}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                        {isSkeleton || jobTitle ? (
                            <Typography
                                size="sm"
                                color="muted"
                                align="center"
                                isSkeleton={isSkeleton}
                                text={jobTitle}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ) : null}
                    </StackV>
                    {isSkeleton || companyTitle ? (
                        <Button
                            isSkeleton={isSkeleton}
                            variant="secondary"
                            size="sm"
                            label={companyTitle ?? ""}
                            prefixIcon={BuildingsIcon}
                            onPress={onOpenCompany}
                            isDisabled={isSkeleton || !onOpenCompany}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    ) : null}
                </StackV>

                {/* full bio — no clamp, unlike ConsultantCard's directory teaser */}
                {isSkeleton || description ? (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={description}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                ) : null}

                {/* contact fork — see file header for why loading shimmers neutrally */}
                {isSkeleton ? (
                    <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                        <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="sm" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                    </StackV>
                ) : contactUnlocked ? (
                    <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                        {(contactLinks ?? []).map((link) => (
                            <Typography
                                key={link.key}
                                size="sm"
                                isLink
                                href={link.href}
                                prefixIcon={link.icon}
                                text={link.label}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ))}
                    </StackV>
                ) : (
                    <FeedbackCallout
                        status="warning"
                        icon={LockIcon}
                        title={LOCKED_TITLE}
                        description={LOCKED_DESCRIPTION}
                        actionLabel={onImproveCv ? LOCKED_CTA_LABEL : undefined}
                        onAction={onImproveCv}
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                    />
                )}
            </StackV>
        </div>
    )
}

export { ConsultantProfileBody }
