import type { Meta, StoryObj } from "@storybook/nextjs"
import { SettingsLayout } from "@sb-components/starci/layouts/SettingsLayout/SettingsLayout"
import type { SettingsNavGroup } from "@sb-components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SettingsLayout` — the chrome around every `/profile/(settings)` route: a nav
 * rail beside a centered content column, column-first on a narrow screen and a
 * row from `@app-md`. `children` is a real slot — the shell stays put while the
 * active page changes underneath. One leaf: the nav-plus-content arrangement
 * never loses a region on data, so which page is active and what it renders are
 * states.
 */
const meta: Meta<typeof SettingsLayout> = {
    title: "StarCi/Layouts/SettingsLayout/SettingsLayout",
    component: SettingsLayout,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SettingsLayout>

const GROUPS: Array<SettingsNavGroup> = [
    {
        key: "account",
        items: [
            { key: "editProfile", href: "/profile/edit" },
            { key: "security", href: "/profile/security" },
        ],
    },
    {
        key: "learning",
        items: [
            { key: "courseHistory", href: "/profile/learning" },
        ],
    },
    {
        key: "content",
        items: [
            { key: "membership", href: "/profile/membership" },
        ],
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the outer switch: full-width column on a narrow screen, becoming a row with the nav beside the content from @app-md — contributing a flush (zero) seam because the visible gutter is the nav's own border, not space this frame adds", storyId: "frames-stack-stackv--default" },
    "SettingsSidebarNav": { tier: "block", role: "owns every way the settings nav renders (desktop rail, mobile strip) and the groups→destinations table itself", storyId: "starci-blocks-navigation-settingssidebarnav-settingssidebarnav--desktop-rail" },
    "Container": { tier: "frame", role: "the centered content measure (max-w-app-md, p-6) the active settings page renders inside", storyId: "frames-container-container--default" },
}

/** LEAF — the only shape this shell has: nav rail beside a centered content column. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SettingsLayout"
                tier="screen"
                leaf="Nav + content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-app-xl"
                states={[
                    {
                        name: "activeHref = /profile/edit",
                        why: "The reader is on the edit-profile page, so the nav highlights that destination while its own content fills the column beside it. The shell itself never changes shape when the active route does — only which item the nav marks current, and what fills `children`.",
                        code: `<SettingsLayout
    groups={groups}
    activeHref="/profile/edit"
    onNavigate={goTo}
    title="Settings"
    collapseLabel="Collapse menu"
    expandLabel="Expand menu"
    storageKey="starci.settings.sidebar.collapsed"
>
    <EditProfilePage />
</SettingsLayout>`,
                        render: (
                            <SettingsLayout


                                groups={GROUPS}
                                activeHref="/profile/edit"
                                onNavigate={() => {}}
                                title="Settings"
                                collapseLabel="Collapse menu"
                                expandLabel="Expand menu"
                                storageKey="starci.settings.sidebar.collapsed"
                            >
                                <div className="rounded-2xl border border-dashed border-default p-6 text-sm text-muted">
                                    "Edit profile" page content — a child route, not owned by this layout.
                                </div>
                            </SettingsLayout>
                        ),
                    },
                    {
                        name: "activeHref = /profile/membership",
                        why: "The reader has navigated to a different destination in a different group. The nav re-marks the new current item and `children` is now an entirely different page — the shell itself stays mounted through the change, which is exactly what a layout is for.",
                        code: `<SettingsLayout
    groups={groups}
    activeHref="/profile/membership"
    onNavigate={goTo}
    title="Settings"
    collapseLabel="Collapse menu"
    expandLabel="Expand menu"
    storageKey="starci.settings.sidebar.collapsed"
>
    <MembershipPage />
</SettingsLayout>`,
                        render: (
                            <SettingsLayout
                                groups={GROUPS}
                                activeHref="/profile/membership"
                                onNavigate={() => {}}
                                title="Settings"
                                collapseLabel="Collapse menu"
                                expandLabel="Expand menu"
                                storageKey="starci.settings.sidebar.collapsed"
                            >
                                <div className="rounded-2xl border border-dashed border-default p-6 text-sm text-muted">
                                    "Membership plan" page content — a child route, not owned by this layout.
                                </div>
                            </SettingsLayout>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
