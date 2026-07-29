import type { Meta, StoryObj } from "@storybook/nextjs"
import { InnerLayout } from "@sb-components/starci/layouts/InnerLayout/InnerLayout"
import type { NavLinkItem, NavbarAccountData, NavbarNotificationsData } from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
import type { FooterLinkItem, FooterSocialLink } from "@sb-components/starci/blocks/navigation/Footer/Footer"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT — `InnerLayout`: the wrapper for EVERY route in the app. See the
 * component's own file header for the full RULE 12 reasoning (why this is a
 * layout, the deliberate `flush` seam, the consolidation note explaining the
 * `AppShell` name this component used to carry, and the documented gaps
 * against the real `src/app/InnerLayout.tsx`).
 *
 * `children` is a REAL slot — each state below swaps its contents to show the
 * shell stays mounted while the routed page underneath changes, exactly the
 * demonstration `SettingsLayout`'s own story already settled on.
 *
 * TWO LEAVES, by STRUCTURE: `showFooter` gains or loses a WHOLE composed node
 * (the Footer), which is the "loses a node ⇒ own leaf" test `ContentHeader`'s
 * `NoOutcomes` leaf already established — not a state of one leaf, because
 * nothing about the Footer's own shape changes, it is simply present or gone.
 */
const meta: Meta<typeof InnerLayout> = {
    title: "StarCi/Layouts/InnerLayout/InnerLayout",
    component: InnerLayout,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InnerLayout>

/** Shared desktop-route fixture, same shape `Navbar`'s own story uses. */
const NAV_ITEMS: Array<NavLinkItem> = [
    { id: "home", label: "Trang chủ", isActive: true, onPress: () => {} },
    { id: "courses", label: "Khoá học", isActive: false, onPress: () => {} },
    { id: "contact", label: "Liên hệ", isActive: false, onPress: () => {} },
]

const NOTIFICATIONS: NavbarNotificationsData = {
    unreadCount: 2,
    items: [
        { id: "n1", title: "Bài nộp đã được chấm", subtitle: "Module 3 · Container hoá", timeLabel: "5 phút trước", isRead: false },
        { id: "n2", title: "Nhắc lịch ôn flashcard", subtitle: "12 thẻ đến hạn hôm nay", timeLabel: "2 giờ trước", isRead: false },
    ],
    isLoading: false,
    error: null,
    onItemPress: () => {},
    onMarkAllRead: () => {},
    onSeeAll: () => {},
    onRetry: () => {},
}

const ACCOUNT: NavbarAccountData = {
    isAuthed: true,
    user: { username: "tranminhanh", email: "tranminhanh@gmail.com", avatarUrl: undefined },
    isLoading: false,
    menuItems: [
        { id: "dashboard", label: "Bảng điều khiển", onPress: () => {} },
        { id: "logout", label: "Đăng xuất", isDanger: true, onPress: () => {} },
    ],
}

const EXPLORE_LINKS: Array<FooterLinkItem> = [
    { id: "courses", label: "Khóa học", onPress: () => {} },
    { id: "blog", label: "Blog", onPress: () => {} },
    { id: "community", label: "Cộng đồng", onPress: () => {} },
]

const SUPPORT_LINKS: Array<FooterLinkItem> = [
    { id: "contact", label: "Liên hệ", onPress: () => {} },
]

const SOCIALS: Array<FooterSocialLink> = [
    { id: "facebook", label: "Facebook", icon: FaFacebook, onPress: () => {} },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, onPress: () => {} },
    { id: "github", label: "GitHub", icon: FaGithub, onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the root track: sticky nav band, growing content, conditional footer — contributing a flush (zero) seam because Navbar/Footer draw their own border", storyId: "frames-stack-stackv--default" },
    "Navbar": { tier: "block", role: "the site-wide nav band (logo, links, search, locale/theme, cart/notifications/account)", storyId: "starci-blocks-navigation-navbar-navbar--desktop" },
    "Footer": { tier: "block", role: "the marketing footer, shown only on routes that opt in", storyId: "starci-blocks-navigation-footer-footer--default" },
}

/** Props for {@link RoutedPage}. */
interface RoutedPageProps {
    /** What this demo route calls itself, e.g. "Nội dung bài học". */
    label: string
}

/** A stand-in for whatever `page.tsx` mounts inside `children` — this shell never learns what it is. */
const RoutedPage = ({ label }: RoutedPageProps) => (
    <div className="rounded-2xl border border-dashed border-default p-6 text-sm text-muted">
        {label} — route con, không thuộc layout này.
    </div>
)

/** LEAF — a `/learn` route: in-app chrome, no marketing footer. */
export const NoFooter: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="InnerLayout"
                tier="screen"
                leaf="showFooter = false"
                annotate={ANNOTATE}
                renderClassName="w-full"
                states={[
                    {
                        name: "/learn — in-app route",
                        why: "A logged-in learner deep inside the product doesn't need marketing chrome below the fold, so the caller passes `showFooter={false}` and the Footer node drops out entirely — the content column simply runs to the bottom of the viewport instead.",
                        code: `<InnerLayout
    showFooter={false}
    navItems={navItems}
    onLogoPress={goHome}
    searchPlaceholder="Tìm bài học, khoá học…"
    shortcutLabel="Ctrl K"
    onSearchPress={openSearch}
    languages={languages}
    activeLocale="vi"
    onLocaleChange={setLocale}
    isDarkMode={false}
    onThemeToggle={setTheme}
    cartCount={2}
    onCartPress={openCart}
    notifications={notifications}
    account={account}
    isMobileDrawerOpen={false}
    onMobileDrawerOpenChange={setMobileDrawerOpen}
    exploreLinks={exploreLinks}
    supportLinks={supportLinks}
    socials={socials}
    onTermsPress={openTerms}
    onPrivacyPress={openPrivacy}
>
    <LearnContentPage />
</InnerLayout>`,
                        render: (
                            <div style={{ height: "32rem" }} className="overflow-y-auto rounded-2xl border border-default">
                                <InnerLayout
                                    anatPart="InnerLayout"
                                    showAnatomy
                                    showFooter={false}
                                    navItems={NAV_ITEMS}
                                    onLogoPress={() => {}}
                                    searchPlaceholder="Tìm bài học, khoá học…"
                                    shortcutLabel="Ctrl K"
                                    onSearchPress={() => {}}
                                    languages={[{ code: "vi", label: "Tiếng Việt" }, { code: "en", label: "English" }]}
                                    activeLocale="vi"
                                    onLocaleChange={() => {}}
                                    isDarkMode={false}
                                    onThemeToggle={() => {}}
                                    cartCount={2}
                                    onCartPress={() => {}}
                                    notifications={NOTIFICATIONS}
                                    account={ACCOUNT}
                                    isMobileDrawerOpen={false}
                                    onMobileDrawerOpenChange={() => {}}
                                    exploreLinks={EXPLORE_LINKS}
                                    supportLinks={SUPPORT_LINKS}
                                    socials={SOCIALS}
                                    onTermsPress={() => {}}
                                    onPrivacyPress={() => {}}
                                >
                                    <div className="p-6">
                                        <RoutedPage label="Nội dung bài học" />
                                    </div>
                                </InnerLayout>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a marketing route: the Footer is a whole extra composed node. */
export const WithFooter: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="InnerLayout"
                tier="screen"
                leaf="showFooter = true"
                annotate={ANNOTATE}
                renderClassName="w-full"
                states={[
                    {
                        name: "/ — marketing landing route",
                        why: "The landing page wants site links/socials below the fold, so the caller passes `showFooter` — the layout grows a whole extra region under the content, still pinned to the bottom of a short page by the same `flex-1` that lets a tall page push it off-screen naturally.",
                        code: `<InnerLayout
    showFooter
    /* …same nav props as above… */
    exploreLinks={exploreLinks}
    supportLinks={supportLinks}
    socials={socials}
    onTermsPress={openTerms}
    onPrivacyPress={openPrivacy}
>
    <LandingScreen />
</InnerLayout>`,
                        render: (
                            <div style={{ height: "40rem" }} className="overflow-y-auto rounded-2xl border border-default">
                                <InnerLayout
                                    anatPart="InnerLayout"
                                    showAnatomy
                                    showFooter
                                    navItems={NAV_ITEMS}
                                    onLogoPress={() => {}}
                                    searchPlaceholder="Tìm bài học, khoá học…"
                                    shortcutLabel="Ctrl K"
                                    onSearchPress={() => {}}
                                    languages={[{ code: "vi", label: "Tiếng Việt" }, { code: "en", label: "English" }]}
                                    activeLocale="vi"
                                    onLocaleChange={() => {}}
                                    isDarkMode={false}
                                    onThemeToggle={() => {}}
                                    cartCount={2}
                                    onCartPress={() => {}}
                                    notifications={NOTIFICATIONS}
                                    account={ACCOUNT}
                                    isMobileDrawerOpen={false}
                                    onMobileDrawerOpenChange={() => {}}
                                    exploreLinks={EXPLORE_LINKS}
                                    supportLinks={SUPPORT_LINKS}
                                    socials={SOCIALS}
                                    onTermsPress={() => {}}
                                    onPrivacyPress={() => {}}
                                >
                                    <div className="p-6">
                                        <RoutedPage label="Trang chủ" />
                                    </div>
                                </InnerLayout>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
