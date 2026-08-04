import type { Meta, StoryObj } from "@storybook/nextjs"
import { NivoTopBar } from "@sb-components/nivo/blocks/navigation/NivoTopBar/NivoTopBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NivoTopBar` — the dashboard shell's top bar. A left breadcrumb (`nivo /
 * <current section>`) plus a right-aligned cluster: theme toggle and the
 * notification bell. `isDark` and `unreadCount` are DATA, so they are STATES
 * of the single shape. The account trigger has moved OUT to `NivoSidebar`'s
 * own pinned account block, so this bar never duplicates an avatar.
 */
const meta: Meta<typeof NivoTopBar> = {
    title: "Nivo/Blocks/Navigation/NivoTopBar/NivoTopBar",
    component: NivoTopBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NivoTopBar>

const BREADCRUMB = { rootLabel: "nivo", onRootPress: () => {}, currentLabel: "Wallet" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": { tier: "atom", role: "the breadcrumb's pressable root segment, its separator, and the bold current-section label", storyId: "atoms-text-typography-typography--truncate" },
    "Button": { tier: "atom", role: "the icon-only theme toggle", storyId: "atoms-buttons-button-button--is-icon-only" },
    "Badge": { tier: "atom", role: "the unread-count badge anchored around the bell glyph; `0` hides it", storyId: "atoms-display-badge-badge--anchored" },
}

/** LEAF — the bar has one shape; `isDark`, `unreadCount`, and `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NivoTopBar"
                tier="block"
                leaf="App top bar"
                annotate={ANNOTATE}
                renderClassName="overflow-hidden rounded-2xl border border-default"
                reason="Blocks take no `className`: the bar owns its cluster, so a screen never restyles it. The bell is a plain button wrapping the `Badge` atom because no icon-only atom can host a badge around its glyph — the same judgement the real `AppTopBar` makes; everything else is a house atom. The breadcrumb is the bar's only data-owning part — the account trigger that used to sit here moved out to `NivoSidebar`'s pinned account block, so no avatar is ever duplicated between the two."
                states={[
                    {
                        name: "dark theme, 3 unread",
                        why: "The default bar: the breadcrumb reads `nivo / Wallet`, the theme toggle shows the SUN (offering a switch back to light), and the bell carries its unread badge.",
                        code: `<NivoTopBar
    breadcrumb={{ rootLabel: "nivo", onRootPress, currentLabel: "Wallet" }}
    theme={{ isDark: true, onThemeToggle }}
    notifications={{ unreadCount: 3, onOpen }}
    themeToggleLabel="Switch to light theme"
    notificationsLabel="Notifications"
/>`,
                        render: (
                            <NivoTopBar
                                breadcrumb={BREADCRUMB}
                                theme={{ isDark: true, onThemeToggle: () => {} }}
                                notifications={{ unreadCount: 3, onOpen: () => {} }}
                                themeToggleLabel="Switch to light theme"
                                notificationsLabel="Notifications"
                            />
                        ),
                    },
                    {
                        name: "light theme, 0 unread",
                        why: "Same bar with the two count/theme data points flipped: the toggle shows the MOON (offering dark), and a zero unread count hides the bell badge entirely rather than rendering a `0`.",
                        code: `<NivoTopBar
    breadcrumb={{ rootLabel: "nivo", onRootPress, currentLabel: "Wallet" }}
    theme={{ isDark: false, onThemeToggle }}
    notifications={{ unreadCount: 0, onOpen }}
    themeToggleLabel="Switch to dark theme"
    notificationsLabel="Notifications"
/>`,
                        render: (
                            <NivoTopBar
                                breadcrumb={BREADCRUMB}
                                theme={{ isDark: false, onThemeToggle: () => {} }}
                                notifications={{ unreadCount: 0, onOpen: () => {} }}
                                themeToggleLabel="Switch to dark theme"
                                notificationsLabel="Notifications"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The current section is not known yet (a route just switched, before the page names itself): the breadcrumb becomes a shimmer bar, while the theme toggle and bell stay live — theme and notification count are always known regardless of route.",
                        code: `<NivoTopBar
    breadcrumb={{ rootLabel: "nivo", onRootPress, currentLabel: "Wallet" }}
    theme={{ isDark: true, onThemeToggle }}
    notifications={{ unreadCount: 3, onOpen }}
    themeToggleLabel="Switch to light theme"
    notificationsLabel="Notifications"
    isSkeleton
/>`,
                        render: (
                            <NivoTopBar
                                breadcrumb={BREADCRUMB}
                                theme={{ isDark: true, onThemeToggle: () => {} }}
                                notifications={{ unreadCount: 3, onOpen: () => {} }}
                                themeToggleLabel="Switch to light theme"
                                notificationsLabel="Notifications"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
