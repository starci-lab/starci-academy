import type { Meta, StoryObj } from "@storybook/nextjs"
import { QRCode } from "@sb-components/atoms/media/QRCode/QRCode"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `QRCode`: an image frame rendering a QR bitmap, with an optional centered icon.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the rule for the ATOM TIER). Every prop with a visual
 * effect gets its own leaf, rendering the FULL set of that prop's values: `size` · `icon`
 * · `isSkeleton`.
 *
 * `data` gets **no leaf of its own** — same call as `Chip`'s `text` and `Button`'s
 * `label`: it is the content the atom renders, not a state to enumerate, so it stays
 * constant across every leaf below and only its value in the code snippet changes.
 *
 * `classNames` gets **no leaf** either, for the same reason no atom story in this
 * system gives one: it only places the atom inside its parent, it never changes how the
 * atom looks (ATOM-5), so there is no visual state for a leaf to show.
 *
 * ⚠️ This atom does not yet tag any element with `data-anat-part` (no `showAnatomy` prop
 * on {@link QRCode} at all), unlike `Button`/`Chip`. The `ANNOTATE` table below is written
 * for when that instrumentation lands; until then the Structure tab stays empty for every
 * leaf, which is expected, not a bug in this story.
 */
const meta: Meta<typeof QRCode> = {
    title: "Atoms/Media/QRCode",
    component: QRCode,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof QRCode>

// Offline-safe inline avatar for the center-icon variant (no external host).
const ICON_SRC =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2028%2028'%3E%3Crect%20width='28'%20height='28'%20fill='%236366f1'/%3E%3Ctext%20x='14'%20y='19'%20font-family='sans-serif'%20font-size='14'%20fill='white'%20text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E"

const AVATAR_ICON = (
    <img alt="" width={28} height={28} src={ICON_SRC} className="rounded-full" />
)

/**
 * The one shimmer this atom can render — HeroUI's own `Skeleton`, at `heroui` tier since
 * it is a vendor element, not a house component with a story of its own.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Skeleton": { tier: "heroui", role: "shimmer standing in for the QR image and its frame while isSkeleton is set" },
}

/** Bare leaf — no optional prop turned on, the plainest QR the atom can render. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QRCode"
                tier="atom"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The one QR shape in the system: a square image frame, no centered icon, not loading. Every leaf below differs from this one by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (size = 160, icon unset, isSkeleton = false)",
                        why: "The frame renders as a plain square QR image with nothing overlaid on it. This is the baseline every other leaf differs from by exactly one prop.",
                        code: "<QRCode size={160} data=\"https://starci.vn/join/lop-fullstack-k12\" />",
                        render: <QRCode size={160} data="https://starci.vn/join/lop-fullstack-k12" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `size` — the rendered width/height of the square QR, in px. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QRCode"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size is the one number that drives the whole frame: the image, the skeleton, and the centered icon's positioning all scale off it. There is no separate small/medium/large token, just the raw pixel count a caller asks for."
                states={[
                    {
                        name: "size = 96 (compact)",
                        why: "The QR renders at its smallest common size, fitting a dense row such as an inline receipt or a payment confirmation card where the code is a secondary detail, not the focus.",
                        code: "<QRCode size={96} data=\"https://starci.vn/payment/inv-88213\" />",
                        render: <QRCode size={96} data="https://starci.vn/payment/inv-88213" />,
                    },
                    {
                        name: "size = 160 (default in this system's call sites)",
                        why: "The QR renders at the size most screens in this app actually reach for, large enough to scan comfortably without dominating the layout around it.",
                        code: "<QRCode size={160} data=\"https://starci.vn/certificate/cert-2026-0721\" />",
                        render: <QRCode size={160} data="https://starci.vn/certificate/cert-2026-0721" />,
                    },
                    {
                        name: "size = 240 (hero)",
                        why: "The QR renders large enough to be the focal point of the screen, the shape for a standalone join/check-in page meant to be scanned from a projector or a printed poster.",
                        code: "<QRCode size={240} data=\"https://starci.vn/event/offline-meetup-2026\" />",
                        render: <QRCode size={240} data="https://starci.vn/event/offline-meetup-2026" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — an optional node centered over the QR (logo/avatar). */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QRCode"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="A centered icon lets a QR carry a brand mark or a person's avatar without a caller reaching in to position it by hand — the atom owns the overlay's placement, background chip, and shadow."
                states={[
                    {
                        name: "icon unset",
                        why: "With no icon handed in, the frame renders the plain QR image with nothing overlaid on it. This is the shape for any code whose payload does not need a visual anchor, such as a plain link.",
                        code: "<QRCode size={160} data=\"https://starci.vn/certificate/cert-2026-0721\" />",
                        render: <QRCode size={160} data="https://starci.vn/certificate/cert-2026-0721" />,
                    },
                    {
                        name: "icon set (centered avatar overlay)",
                        why: "A small circular avatar sits centered over the code, wrapped in the atom's own background chip so the QR's own modules never touch the icon's edge. Reach for it when the code belongs to a person or a brand the reader should recognize before they even scan it.",
                        code: `<QRCode
  size={160}
  data="https://starci.vn/certificate/cert-2026-0721"
  icon={<img alt="" width={28} height={28} src={avatarSrc} className="rounded-full" />}
/>`,
                        render: (
                            <QRCode size={160} data="https://starci.vn/certificate/cert-2026-0721" icon={AVATAR_ICON} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — a CO-LOCATED shimmer, the same `size`×`size` box and
 * radius as the real image, with no `icon` mounted while unresolved.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QRCode"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="The QR is a fixed square whose side is already the size prop, not a width that varies with content, so the shimmer needs no width of its own — it copies size directly. Whoever owns the shape owns its loading state; there is no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true, size = 96 (compact)",
                        why: "The shimmer stands at the same 96px box the compact QR would take, so a payment card never jumps once the real code lands.",
                        code: "<QRCode size={96} data=\"https://starci.vn/payment/inv-88213\" isSkeleton />",
                        render: <QRCode size={96} data="https://starci.vn/payment/inv-88213" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = 160 (default)",
                        why: "The shimmer stands at the default 160px box, the loading placeholder most QR call sites in this app will show while the payload URL is still being resolved.",
                        code: "<QRCode size={160} data=\"https://starci.vn/certificate/cert-2026-0721\" isSkeleton />",
                        render: <QRCode size={160} data="https://starci.vn/certificate/cert-2026-0721" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = 240 (hero)",
                        why: "The shimmer stands at the full 240px hero box, matching the largest QR the atom renders, so a standalone join page never resizes when the real code appears.",
                        code: "<QRCode size={240} data=\"https://starci.vn/event/offline-meetup-2026\" isSkeleton />",
                        render: <QRCode size={240} data="https://starci.vn/event/offline-meetup-2026" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
