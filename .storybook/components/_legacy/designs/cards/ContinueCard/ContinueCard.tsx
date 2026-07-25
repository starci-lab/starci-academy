import React from "react"
import { Link, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { HighlightCard } from "@sb-components/layouts/cards/HighlightCard/HighlightCard"
import { SectionCard } from "@sb-components/_legacy/designs/cards/SectionCard/SectionCard"
import { SeeMoreLink } from "@sb-components/atoms/navigation/SeeMoreLink/SeeMoreLink"
import { ProgressMeter } from "@sb-components/layouts/stats/ProgressMeter/ProgressMeter"
import { List } from "@sb-components/layouts/lists/List/List"
import { StatusChip } from "@sb-components/atoms/chips/StatusChip/StatusChip"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/cards/ContinueCard`. Composed from the local primitives
 * `SectionCard` (frame) + `HighlightCard` (sweep wrapper for `hero`) +
 * `SeeMoreLink` (item CTA) + `ProgressMeter` (progress). Synced to `src` later.
 */

/**
 * Shape of a {@link ContinueCard} — derived from what the surface IS, not from
 * individual style flags.
 *
 * - `"item"` — one of N resume cards in a grid/list. The card is a static frame;
 *   the CTA is a real {@link SeeMoreLink} ("Tiếp tục →") on its own row — hover
 *   and click live on that link only. It carries NO leading icon and no accent
 *   ring (N accented cards means none of them stands out).
 * - `"hero"` — the single standout "you left this in progress" card on a
 *   surface. The CTA is a real chip button on its own row, `icon` sinks behind
 *   the content as a watermark, and the card gets an accent ring.
 * - `"plain"` — frameless: same content (eyebrow · title · subtitle/meta ·
 *   {@link ProgressMeter} · cta) but with NO {@link SectionCard}/{@link HighlightCard}
 *   chrome. Used as the spine of a page (e.g. the top of a "continue learning"
 *   surface) where the surrounding page shell already provides the frame. The
 *   CTA is a chip button like `hero` (own row); it carries no leading icon and
 *   no accent ring — a bare surface has nothing to sink an icon behind.
 */
export type ContinueCardVariant = "item" | "hero" | "plain"

/**
 * Props for the {@link ContinueCard} block.
 *
 * A presentational, props-only card that surfaces a single "continue where you
 * left off" item. All interactivity is delivered by the caller via
 * {@link ContinueCardProps.onPress} or {@link ContinueCardProps.href}; the block
 * fetches nothing and reads no global store.
 */
export interface ContinueCardProps {
    /**
     * What this card IS on its surface — see {@link ContinueCardVariant}.
     * Required: it decides icon placement, CTA affordance, and accent together,
     * so a surface cannot end up with an arbitrary mix of the three.
     */
    variant: ContinueCardVariant
    /**
     * Primary label of the item being continued (course / module / lesson
     * title). Rendered via {@link Typography} weight="medium", truncated to one
     * line.
     */
    title: React.ReactNode
    /**
     * Nhãn mờ nhỏ TRÊN tiêu đề (vd "Tiếp tục học") — render qua {@link Typography}
     * `body-xs` `muted`.
     *
     * ⚠️ CHỈ dùng với `variant="plain"` (thầy soi mắt 2026-07-25). Eyebrow sinh ra để
     * THAY cho cái khung: frameless thì không có gì nói cụm này là gì nên cần một dòng
     * nhãn nhẹ. `hero` đã có khung + vành arc + CTA "Tiếp tục" ⇒ thêm eyebrow là nói
     * hai lần; `item` nằm trong danh sách N thẻ ⇒ mỗi thẻ một eyebrow là nhiễu.
     * (Bản cũ ghi "valid on any variant" nên đã bị bê nhầm sang `hero` — siết lại.)
     */
    eyebrow?: React.ReactNode
    /**
     * Optional secondary label under the title — e.g. module name, lesson
     * number, or position in a session. Truncated to one line.
     */
    subtitle?: React.ReactNode
    /**
     * Current progress. The {@link ProgressMeter} renders if and only if this is
     * provided — pass it only when real progress data exists.
     */
    value?: number
    /** Maximum value representing 100 % completion. Defaults to `100`. */
    max?: number
    /**
     * Optional call-to-action label (e.g. "Tiếp tục"). Rendered — on its OWN
     * row below the title/subtitle — as a real {@link SeeMoreLink} for
     * `variant="item"`, and as a chip button for `variant="hero"`.
     */
    ctaLabel?: React.ReactNode
    /**
     * Optional semantic momentum cue (e.g. a streak / clock icon). Rendered ONLY
     * for `variant="hero"`, where it sinks behind the content as a watermark;
     * `variant="item"` shows no leading icon, so passing one there is a no-op.
     * Decorative for a11y — {@link ContinueCardProps.title} carries the name.
     */
    icon?: React.ReactNode
    /**
     * Neutral meta segments (dot-joined, muted) — rendered via {@link List.Meta}.
     * The hero variant uses this instead of {@link ContinueCardProps.subtitle}.
     * Do NOT put a time-remaining fact here — pass it as {@link ContinueCardProps.timeLeft}
     * so it always reads as the same time chip across scenarios.
     */
    meta?: React.ReactNode[]
    /**
     * Time-remaining fact (e.g. "40 minutes left") — ALWAYS rendered as a leading
     * time {@link StatusChip} in {@link List.Meta}, so the same info type reads as the
     * same element in every scenario. Prominence escalates via {@link ContinueCardProps.urgent}
     * (tone), NOT by switching element type. Never fabricate a countdown.
     */
    timeLeft?: React.ReactNode
    /**
     * Escalates the {@link ContinueCardProps.timeLeft} chip to `warning` tone when the
     * remaining time is genuinely running out; otherwise the chip stays `neutral` (muted).
     * Tone-only — it never repaints the whole meta line.
     */
    urgent?: boolean
    /**
     * Optional press handler. For `variant="item"` it wires to the
     * {@link SeeMoreLink} CTA; for `variant="hero"` it wires to the CTA chip.
     * Prefer {@link ContinueCardProps.href} for pure navigation.
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link ContinueCardProps.onPress}. */
    href?: string
    /** Extra classes on the card root. */
    className?: string
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
    /**
     * Anatomy tag cho CHÍNH card này — caller badge nó như MỘT node (§11a). Gắn lên
     * root NGOÀI CÙNG, khác nhau theo variant: `plain` → div gốc · `hero` →
     * HighlightCard (vành ngoài) · `item` → SectionCard.
     */
    anatPart?: string
}

/**
 * ContinueCard renders a "pick up where you left off" surface: an optional
 * eyebrow, an info row (title + subtitle), then a CTA row (every variant
 * renders `ctaLabel` here, never inline with the title), then a
 * {@link ProgressMeter} when {@link ContinueCardProps.value} is provided.
 *
 * - `hero` wraps the content in {@link SectionCard} then {@link HighlightCard}
 *   for the sweeping-light ring.
 * - `item` wraps the content in {@link SectionCard} only (static frame).
 * - `plain` renders the SAME content with NO frame — a bare spine for a page
 *   that already provides its own surrounding surface.
 *
 * @param props - {@link ContinueCardProps}
 */
export const ContinueCard = ({
    variant,
    title,
    eyebrow,
    subtitle,
    value,
    max = 100,
    ctaLabel,
    icon,
    meta,
    timeLeft,
    urgent = false,
    onPress,
    href,
    className,
    showAnatomy = false,
    anatPart,
}: ContinueCardProps) => {
    const isHero = variant === "hero"
    const isPlain = variant === "plain"
    // Item CTA is a real SeeMoreLink (own hover + click). Never wrap the card —
    // that would nest interactive controls and steal hover from the link.
    // Hero/plain CTA is a chip button — also its own control, so the card
    // (or bare content, for `plain`) stays a static frame too.
    const useChipCta = variant !== "item"

    const ctaNode = ctaLabel
        ? useChipCta
            ? href
                // NOTE: Button port has NO `href` — it's not a link. This is a hand-rolled
                // <Link>-as-pill (styled to match the primary Button look); left as-is
                // (deferred until the Button port grows an `href`/`as` escape hatch).
                ? (
                    <Link
                        href={href}
                        data-anat-part={showAnatomy ? "Link" : undefined}
                        className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-3xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground no-underline"
                    >
                        {ctaLabel}
                        <ArrowRightIcon
                            aria-hidden
                            focusable="false"
                            className="size-3.5"
                        />
                    </Link>
                )
                : (
                    <Button
                        variant="primary"
                        size="sm"
                        onPress={onPress}
                        anatPart={showAnatomy ? "Button" : undefined}
                        className="w-fit shrink-0"
                        icon={
                            <ArrowRightIcon
                                aria-hidden
                                focusable="false"
                            />
                        }
                    >
                        {ctaLabel}
                    </Button>
                )
            : (
                <SeeMoreLink.Base
                    href={href}
                    onPress={onPress}
                    anatPart={showAnatomy ? "SeeMoreLink" : undefined}
                    label={ctaLabel}
                />
            )
        : null

    const content = (
        <>
            {isHero && icon ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-6 text-accent-soft-foreground opacity-40 [&_svg]:size-32"
                >
                    {icon}
                </div>
            ) : null}

            {eyebrow ? (
                <Typography.Base size="xs"
                    color="muted"
                    truncate
                    showAnatomy={showAnatomy}
                    text={eyebrow}
                />
            ) : null}

            <div className="relative flex items-center gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Typography.Base
                        weight="medium"
                        truncate
                        showAnatomy={showAnatomy}
                        text={title}
                    />
                    {meta || timeLeft ? (
                        <List.Meta
                            items={meta ?? []}
                            anatPart={showAnatomy ? "List.Meta" : undefined}
                            chip={
                                timeLeft ? (
                                    // Same info type (time remaining) → same element (a time
                                    // StatusChip) in EVERY scenario; only the tone escalates:
                                    // `neutral` (muted) when there's time, `warning` when running out.
                                    <StatusChip.Base
                                        tone={urgent ? "warning" : "neutral"}
                                        anatPart={showAnatomy ? "StatusChip" : undefined}
                                        text={timeLeft}
                                    />
                                ) : undefined
                            }
                        />
                    ) : subtitle ? (
                        <Typography.Base size="xs"
                            color="muted"
                            truncate
                            showAnatomy={showAnatomy}
                            text={subtitle}
                        />
                    ) : null}
                </div>
            </div>

            {/* Tiến độ BÁM ngay dưới cụm chữ, TRƯỚC nút (thầy soi mắt 2026-07-25).
            Trước đó nó nằm CUỐI — sau CTA — nên rơi tách khỏi card, lửng lơ giữa hai
            khối và đọc nhầm thành của khối bên dưới. Thứ tự đúng: đang ở đâu → tiến
            độ bao nhiêu → làm gì tiếp. */}
            {value === undefined ? null : (
                <ProgressMeter value={value} max={max} anatPart={showAnatomy ? "ProgressMeter" : undefined} />
            )}

            {ctaNode ? <div className="relative">{ctaNode}</div> : null}
        </>
    )

    // `hero` = the ONE "tiếp tục phiên đang dở" standout on its surface — the
    // canonical `HighlightCard` case (`card.md` §3j). `item` stays a static frame
    // (N of them together — a highlighted card would just fight the others).
    // `plain` = SAME content, NO frame — a bare spine (page already provides the surface).
    if (isPlain) {
        return (
            <div
                data-anat-part={anatPart ?? (showAnatomy ? "PlainRoot" : undefined)}
                className={cn("relative flex flex-col gap-3", className)}
            >
                {content}
            </div>
        )
    }

    // hero: badge gốc nằm ở HighlightCard (vành ngoài cùng) nên SectionCard giữ tên
    // nội bộ; item/plain: SectionCard CHÍNH LÀ root nên nó nhận `anatPart` của caller.
    const cardNode = (
        <SectionCard
            anatPart={isHero ? (showAnatomy ? "SectionCard" : undefined) : anatPart ?? (showAnatomy ? "SectionCard" : undefined)}
            className={cn("relative flex flex-col overflow-hidden", className)}
            contentClassName="flex flex-col gap-3"
        >
            {content}
        </SectionCard>
    )

    return isHero ? (
        <HighlightCard anatPart={anatPart ?? (showAnatomy ? "HighlightCard" : undefined)}>{cardNode}</HighlightCard>
    ) : (
        cardNode
    )
}
