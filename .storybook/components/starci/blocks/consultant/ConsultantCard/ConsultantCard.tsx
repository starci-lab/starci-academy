import React from "react"
import { BuildingsIcon } from "@phosphor-icons/react"
import { Image } from "@sb-components/atoms/media/Image/Image"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ConsultantCard`: ONE recruiting consultant as a self-contained
 * pressable tile — photo, name, role, company, blurb. Opening it is the whole
 * point of the card, so it reuses `SurfaceCard.Pressable` (composite,
 * navigation behaviour) rather than reaching for the bare `Image`/`Typography`
 * atoms and hand-rolling a `<button>` around them — the exact mistake this run
 * exists to correct (see `ContentModeNav`'s file header for the prior
 * incident).
 *
 * A DOMAIN IDENTITY BLOCK, not a one-off. It knows what a "consultant" is (a
 * person with a role and a company, offered so a visitor can open their
 * profile) — a fact neither `SurfaceCard.Pressable` (content-agnostic khung)
 * nor `Image`/`Typography` (no domain at all) can know on their own. Reusable
 * wherever ONE consultant needs to be shown — today's `ConsultantDirectoryGrid`
 * tiles, tomorrow's not-yet-built profile overlay.
 *
 * ⚠️ DOES NOT FORWARD `isSkeleton` INTO `SurfaceCard.Pressable`'s OWN flag.
 * `.Pressable`'s built-in skeleton branch swaps in a FIXED, DIFFERENT shape —
 * a horizontal row (leading avatar + two text bars, see its source) — because
 * that generic mirror was drawn for a leading-avatar list tile, not a
 * top-aligned photo tile. Feeding this block's `isSkeleton` into that branch
 * would flip the layout from vertical (photo → name → role → company → blurb)
 * to horizontal on every load, which is the shape-drift `feedback-fix-skeleton
 * -with-every-layout-change` warns about. Instead this block keeps `.Pressable`
 * on its REAL branch always and pushes `isSkeleton` straight into `Image` and
 * `Typography`, the atoms that actually draw each part (§12c) — the composite
 * only loses its `onPress` wiring (`isDisabled`) while there is nothing real
 * to open yet.
 *
 * DURING LOADING every optional row (role / company / blurb) is drawn as a
 * shimmer bar, same convention as `ContentHeader`'s outcomes card: the caller
 * does not yet know the final shape, so the loading state shows the full one.
 *
 * COMPANY IS PLAIN TEXT WITH A LEADING ICON, never a nested link (per the task
 * brief's risk note) — the card is already ONE press target; a second
 * interactive element inside it would either be unreachable (nested inside
 * the whole-card `<button>`/`<a>`) or require the stretched-link `actions`
 * pattern for a fact that carries no action of its own.
 *
 * ⚠️ `SurfaceCard.Pressable` and `Image` have NO `anatPart` prop of their own
 * (only `showAnatomy`) — unlike `PageHeader`/`Breadcrumbs` in `ContentHeader`,
 * neither accepts a caller-supplied part name. Both are wrapped in a plain
 * `<div>` instead, same pattern `ContentHeader` uses for
 * `Breadcrumbs`.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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
        <StackV gap={1} body={(
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    truncate
                    isSkeleton={isSkeleton}
                    text={fullName}

                />
                {isSkeleton || jobTitle ? (
                    <Typography
                        size="xs"
                        color="muted"
                        truncate
                        isSkeleton={isSkeleton}
                        text={jobTitle}

                    />
                ) : null}
            </>
        )} />
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

                    body={() => <StackV gap={4} body={consultantInfo} />}
                />
            </div>
        </div>
    )
}

export { ConsultantCard }
