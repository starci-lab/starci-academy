import React from "react"
import { BuildingsIcon, LockIcon } from "@phosphor-icons/react"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Typography, type TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ConsultantProfileBody` — a BLOCK: the full detail content of one consultant's
 * profile — photo, name+role, a pressable company row, the full bio, and a fork on
 * the way out: real contact links once unlocked, or a locked callout with a way to
 * unlock them.
 *
 * The detail sibling of `ConsultantCard` (same `Consultant` entity, different job).
 * Shapes differ deliberately: here the company row is a real `Button`
 * (`onOpenCompany`) since the whole-card press is spent, and the bio renders in
 * full rather than clamped.
 *
 * The contact fork reuses the `Callout` composite (a status alert + one CTA) rather
 * than a hand-rolled `Alert` + `Button`. Contact links carry no callback — they are
 * plain navigable data (`href`) rendered via `Typography`'s `isLink` + `href`; the
 * two callbacks are `onOpenCompany` and `onImproveCv`.
 *
 * One leaf: `contactUnlocked` is a state (only the last slot's content changes).
 * During `isSkeleton` the contact fork shimmers neutrally rather than asserting
 * either branch. The locked callout's title/description are block-owned text.
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
}

/** Fixed copy for the locked-contact callout — block-owned wording (§14d.1), see file header. */
const LOCKED_TITLE = "Contact is locked"
const LOCKED_DESCRIPTION = "Improve your CV to unlock this consultant's contact information."
const LOCKED_CTA_LABEL = "Improve CV"

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
}: ConsultantProfileBodyProps) => {
    const { fullName, jobTitle, companyTitle, description, avatarUrl, contactUnlocked, contactLinks } = consultant

    const nameRow = (
        <StackV gap={1} align="center" isSkeleton={isSkeleton} items={[
            () => (
                <Typography
                    size="h4"
                    weight="bold"
                    align="center"
                    isSkeleton={isSkeleton}
                    text={fullName}

                />
            ),
            ...(isSkeleton || jobTitle ? [() => (
                <Typography
                    size="sm"
                    color="muted"
                    align="center"
                    isSkeleton={isSkeleton}
                    text={jobTitle}

                />
            )] : []),
        ]} />
    )

    // identity: centered photo, name+role, pressable company row
    const identity = (
        <StackV gap={4} align="center" isSkeleton={isSkeleton} items={[
            () => (
                <div className="w-28">
                    <Image
                        src={avatarUrl}
                        alt={fullName}
                        ratio="square"
                        radius="full"
                        isSkeleton={isSkeleton}

                    />
                </div>
            ),
            () => nameRow,
            ...(isSkeleton || companyTitle ? [() => (
                <Button
                    isSkeleton={isSkeleton}
                    variant="secondary"
                    size="sm"
                    label={companyTitle ?? ""}
                    prefixIcon={BuildingsIcon}
                    onPress={onOpenCompany}
                    isDisabled={isSkeleton || !onOpenCompany}

                />
            )] : []),
        ]} />
    )

    // contact fork — see file header for why loading shimmers neutrally
    const contactFork = isSkeleton ? (
        <StackV gap={2} isSkeleton={isSkeleton} items={[
            () => <Typography size="sm" isSkeleton classNames={["w-1/2"]} />,
            () => <Typography size="sm" isSkeleton classNames={["w-1/3"]} />,
        ]} />
    ) : contactUnlocked ? (
        <StackV gap={2} isSkeleton={isSkeleton} items={(contactLinks ?? []).map((link) => () => (
            <Typography
                size="sm"
                isLink
                href={link.href}
                prefixIcon={link.icon}
                text={link.label}

            />
        ))} />
    ) : (
        <Callout
            status="warning"
            icon={LockIcon}
            title={LOCKED_TITLE}
            description={LOCKED_DESCRIPTION}
            actionLabel={onImproveCv ? LOCKED_CTA_LABEL : undefined}
            onAction={onImproveCv}


        />
    )

    return (
        <div>
            <StackV gap={6} isSkeleton={isSkeleton} items={[
                () => identity,
                // full bio — no clamp, unlike ConsultantCard's directory teaser
                ...(isSkeleton || description ? [() => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={description}

                    />
                )] : []),
                () => contactFork,
            ]} />
        </div>
    )
}

export { ConsultantProfileBody }
