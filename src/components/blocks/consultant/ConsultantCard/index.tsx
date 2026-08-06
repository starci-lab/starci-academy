import React from "react"
import { BuildingsIcon } from "@phosphor-icons/react"
import { Image } from "@/components/atoms/media/Image"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackV } from "@/components/frames/Stack"

/**
 * `ConsultantCard` — one recruiting consultant as a self-contained pressable
 * tile (photo, name, role, company, blurb) that opens their profile on press.
 * Built on `SurfaceCard.Pressable`. `Minimal` drops `jobTitle`/`companyTitle`/
 * `description` together; `isSkeleton` keeps the same tree as shimmer.
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
        <SurfaceCard
            identity={{ tier: "block", component: "ConsultantCard" }}
            onPress={() => onOpen(id)}
            isDisabled={isSkeleton}
            body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => consultantInfo]} />}
        />
    )
}

export { ConsultantCard }
