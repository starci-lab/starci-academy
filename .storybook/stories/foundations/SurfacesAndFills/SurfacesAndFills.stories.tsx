import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { HouseIcon } from "@phosphor-icons/react"

/**
 * SURFACE & FILL — when to use `bg-surface`, when SOLID `bg-accent`, when TINT `bg-accent-soft`.
 * Source: canon `foundations/elevation.md` + `foundations/color.md` §2-3 + `principles/accent-system.md`.
 * Semantic tokens ONLY (NO hex / slate-* / cyan-500). Keep the demo of REAL colors/elevation — don't flatten it into a text table.
 */
const meta: Meta = {
    title: "Core/Foundations/Surfaces & Fills",
}
export default meta
type Story = StoryObj

/** Backgrounds by ELEVATION — desk (background) → paper (surface) → nested gets a border, not a shadow. */
export const Elevation: Story = {
    render: () => (
        <div className="max-w-2xl rounded-3xl bg-background p-6">
            <p className="mb-3 text-xs text-muted"><code className="rounded bg-default px-1 text-foreground">bg-background</code> — the PAGE background (the desk)</p>
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <p className="mb-3 text-sm text-foreground"><code className="rounded bg-default px-1">bg-surface</code> + <code className="rounded bg-default px-1">shadow-surface</code> — a top-level card (a sheet of paper resting on the desk)</p>
                <div className="rounded-2xl border border-default bg-transparent p-3">
                    <p className="text-sm text-muted">A block NESTED inside a card → <code className="rounded bg-default px-1 text-foreground">border border-default</code> + <code className="rounded bg-default px-1 text-foreground">bg-transparent</code> — NO shadow, NO fill over fill (the shadow dies in dark mode).</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "Backgrounds by elevation: `bg-background` (desk) → `bg-surface` (paper). Top-level elevation = `shadow-surface` (drop the border, `.card{border:none}`). Nested/surface-in-surface = `border border-default` (because `--surface-shadow` is invisible in dark). Rule: top-level = shadow · nested = border · NEVER two stacked fill layers.",
    },
}

/** ACCENT SOLID vs TINT — two different roles, don't mix them up. */
export const AccentSolidVsTint: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent solid</Label>
                    <Typography type="body-sm" color="muted">
                        The primary CTA, at most one per screen; text and icon white via accent-foreground. Use for Continue learning, Sign up, Checkout.
                    </Typography>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-field bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Continue learning
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent soft (tint)</Label>
                    <Typography type="body-sm" color="muted">
                        Marks the selected item in a nav, tab, sidebar, chip, or radio-card; a tinted background with the label and icon in the accent color, only for small bounded blocks.
                    </Typography>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-2 text-sm font-medium text-accent-soft-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Home (selected)
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Mine in a list</Label>
                    <Typography type="body-sm" color="muted">
                        Highlight the user's own card or row with an accent ring or border plus one accent detail; keep the background bg-surface, don't fill the whole block.
                    </Typography>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-accent bg-surface p-3 shadow-surface">
                    <span className="text-sm text-foreground">My rank</span>
                    <span className="text-sm font-semibold text-accent-soft-foreground">#12</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "PRIMARY = SOLID `bg-accent` + white text/icon (`--accent-foreground`) — the primary CTA, 1/screen. TINT `bg-accent-soft` + accent label & icon = SELECTED (nav/tab/chip/radio-card), ONLY SMALL bounded blocks. 'Mine' = accent ring/border + 1 accent value, bg-surface background. Each element uses ONLY 1 accent CHANNEL (background OR text OR icon OR border — never combined).",
    },
}

/** Anti-pattern — accent is a SEASONING, a few touches per screen. Don't paint large background areas. */
export const AccentAntiPatterns: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent-flood (forbidden)</Label>
                    <Typography type="body-sm" color="muted">
                        Don't paint bg-accent-soft over a card, section, or large thumbnail; a block's background must be bg-surface or bg-default, with accent only as a small detail.
                    </Typography>
                </div>
                <div className="flex gap-3">
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl bg-accent-soft text-xs text-accent-soft-foreground line-through opacity-70">
                        whole card bg-accent-soft
                    </div>
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-default bg-surface text-xs text-muted shadow-surface">
                        correct: bg-surface + accent on a detail
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Status-tint (forbidden)</Label>
                    <Typography type="body-sm" color="muted">
                        Don't paint bg-accent-soft over an in-progress status row — it looks selected; let the icon carry the color, keep the text foreground, and the background transparent.
                    </Typography>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4 text-accent-soft-foreground" weight="fill" />
                    Lesson in progress (correct: accent icon only, no tint)
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "Accent = a SIGNAL, not decoration — a few touches per screen (60-30-10). FORBIDDEN: ACCENT-FLOOD (tinting large background areas) · STATUS-TINT (filling a status row's background → fake selected; let the icon carry the status color) · ACCENT-FOR-DONE (done must be green `text-success-soft-foreground`, not accent) · 3 CHANNELS for one meaning. Accent is ONLY for 4 roles: the primary CTA · selected · brand · mine.",
    },
}
