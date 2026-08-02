import React from "react"
import { BuildingsIcon } from "@phosphor-icons/react"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ConsultantCard` — a BLOCK: one recruiting consultant as a self-contained
 * pressable tile (photo, name, role, company, blurb). Opening it is the whole
 * point, so it reuses `SurfaceCard.Pressable` rather than hand-rolling a
 * `<button>` around bare atoms. A domain identity block: it knows what a
 * "consultant" is, reusable wherever one consultant is shown.
 *
 * Does NOT forward `isSkeleton` into `SurfaceCard.Pressable`'s own flag: that
 * built-in skeleton is a horizontal leading-avatar row, which would flip this
 * top-aligned photo tile's layout on every load. Instead the block keeps
 * `.Pressable` on its real branch (only dropping `onPress` via `isDisabled`) and
 * pushes `isSkeleton` straight into `Image` and `Typography`. During loading every
 * optional row (role / company / blurb) is drawn as a shimmer bar.
 *
 * Company is plain text with a leading icon, never a nested link — the card is
 * already one press target.
 */

/** One recruiting consultant — plain data, the block builds the tile from it. */
export interface ConsultantCardConsultant {
    /** Stable id, passed back to {@link ConsultantCardProps.onOpen}. */
    id: string
    /** Full name — the card's accessible name. */
    fullName: string
    /** Role/title at their company. Row disappears when absent. */
    jobTitle?: string
    /** Company name. Row disappears when absent. */
    companyTitle?: string
    /** Short bio/blurb. Row disappears when absent. */
    description?: string
    /** Photo URL. Empty/missing → `Image`'s own fallback glyph, never a blank frame. */
    avatarUrl?: string
}

/** Props for {@link ConsultantCard}. */
export interface ConsultantCardProps {
    /** The consultant this tile represents. */
    consultant: ConsultantCardConsultant
    /** Fired with {@link ConsultantCardConsultant.id} when the visitor opens this consultant's profile. */
    onOpen: (id: string) => void
    /**
     * `true` → `Image` and every `Typography` line switch to their own shimmer,
     * and the tile stops accepting presses (there is no id to open yet). See
     * the file header for why this does NOT flow into `.Pressable`'s own flag.
     */
    isSkeleton?: boolean
}

/**
 * ONE consultant tile. See the file header for the full contract.
 *
 * @param props - {@link ConsultantCardProps}
 */
const ConsultantCard = ({
    consultant,
    onOpen,
    isSkeleton = false,
}: ConsultantCardProps) => {
    const { id, fullName, jobTitle, companyTitle, description, avatarUrl } = consultant

    const nameRow = (
        <StackV gap={1} isSkeleton={isSkeleton} items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    truncate
                    isSkeleton={isSkeleton}
                    text={fullName}

                />
            ),
            ...(isSkeleton || jobTitle ? [() => (
                <Typography
                    size="xs"
                    color="muted"
                    truncate
                    isSkeleton={isSkeleton}
                    text={jobTitle}

                />
            )] : []),
        ]} />
    )

    const consultantInfo = (
        <>
            <div>
                <Image
                    src={avatarUrl}
                    alt={fullName}
                    ratio="square"
                    radius="lg"
                    isSkeleton={isSkeleton}

                />
            </div>
            {nameRow}
            {isSkeleton || companyTitle ? (
                <Typography
                    size="xs"
                    color="muted"
                    truncate
                    prefixIcon={BuildingsIcon}
                    isSkeleton={isSkeleton}
                    text={companyTitle}

                />
            ) : null}
            {isSkeleton || description ? (
                <Typography
                    size="sm"
                    color="muted"
                    lineClamp={2}
                    isSkeleton={isSkeleton}
                    text={description}

                />
            ) : null}
        </>
    )

    return (
        <div>
            <div>
                <SurfaceCard
                    onPress={() => onOpen(id)}
                    isDisabled={isSkeleton}

                    body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => consultantInfo]} />}
                />
            </div>
        </div>
    )
}

export { ConsultantCard }
