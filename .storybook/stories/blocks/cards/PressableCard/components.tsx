import { Typography } from "@heroui/react"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"

/**
 * Generic navigation-tile content — icon + title + subtitle. The leading icon is
 * a real {@link IconTile} (this row represents ONE object — a course roadmap —
 * per the biz→ui lookup "a row's leading = 1 object → IconTile"), not a
 * hand-rolled emoji circle (emoji are banned from UI copy either way).
 */
export const NavTileContent = () => (
    <div className="flex items-center gap-3">
        <IconTile size="sm" icon={<RocketLaunchIcon />} />
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
                Fullstack Mastery roadmap
            </span>
            <span className="text-xs text-muted">
                12 modules · 48 lessons
            </span>
        </div>
    </div>
)

/** Generic option-card content — used for "pick a card" demos. */
export const OptionCardContent = ({ label, price }: { label: string; price: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{price}</span>
    </div>
)

/**
 * PROTOTYPE of the "link-card" variant about to be added to PressableCard (hand-built in
 * the story to lock the SHAPE first, before baking the `title`/`subtitle`/`hover="underline"`
 * props into the real component). The whole card is ONE navigation target — `router.push` to
 * another page; hovering the whole card UNDERLINES the label (it is essentially a link) and
 * does NOT fill the background; there is no trailing "Read→/Review→" CTA. Keep `shadow-surface`
 * at rest so it still reads as a card.
 */
export const LinkCardPrototype = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <button
        type="button"
        onClick={() => {}}
        className="group block w-full cursor-pointer rounded-3xl bg-surface p-3 text-left shadow-surface outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
        <div className="flex flex-col gap-0">
            <Typography type="body-sm" className="group-hover:underline">
                {title}
            </Typography>
            <Typography type="body-xs" color="muted">
                {subtitle}
            </Typography>
        </div>
    </button>
)
