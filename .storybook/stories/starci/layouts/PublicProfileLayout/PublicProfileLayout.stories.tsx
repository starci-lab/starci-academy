import type { Meta, StoryObj } from "@storybook/nextjs"
import { PublicProfileLayout } from "@sb-components/starci/layouts/PublicProfileLayout/PublicProfileLayout"
import type { PublicProfileUser } from "@sb-components/starci/layouts/PublicProfileLayout/PublicProfileLayout"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT — `PublicProfileLayout`: the wrapper mounted once per
 * `/profile/[username]/**` scope. See the component's own file header for the
 * full contract, why this is a `layouts/` file, and every judgement call.
 *
 * FOUR LEAVES BY STRUCTURE (§14d.2), the same "loading → not-found → locked →
 * content" branch order the real `PublicProfile` checks, each swapping the
 * WHOLE composed body rather than flipping a prop on one shared shape:
 *   - `Loading`  — `ProfileLoadingState` alone.
 *   - `NotFound` — `ProfileNotFoundState` alone.
 *   - `Locked`   — `ProfileLockedState` alone (identity stays visible, tabs withheld).
 *   - `Content`  — the real shape: `ProfileTabsBar` chrome above a two-column
 *     `ProfileHero` + route-panel body. Owner-vs-visitor tab gating and the
 *     `canHire` CTA fork are DATA differences (this layout's own `resolveProfileTabs`/
 *     `canHire` computation), folded into `states` inside this one leaf — mirrors
 *     `ProfileTabsBar`'s own story, which does the identical fold for the same reason.
 *
 * All five composed leaves (`ProfileHero`/`ProfileTabsBar`/`ProfileLoadingState`/
 * `ProfileNotFoundState`/`ProfileLockedState`) had landed with their own real
 * stories by the time this file was written, so every `ANNOTATE` entry below
 * points at an actual `storyId`.
 */
const meta: Meta<typeof PublicProfileLayout> = {
    title: "StarCi/Layouts/PublicProfileLayout/PublicProfileLayout",
    component: PublicProfileLayout,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PublicProfileLayout>

/** Stand-in for a real active tab's own route panel — this layout never knows what it renders. */
interface RouteContentProps {
    /** Caption explaining which tab route this stand-in represents. */
    label: string
}

const RouteContent = ({ label }: RouteContentProps) => (
    <div className="flex flex-col gap-3">
        <div className="h-6 w-1/3 rounded bg-default" />
        <div className="h-4 w-2/3 rounded bg-default" />
        <div className="h-40 rounded-2xl bg-surface shadow-surface" />
        <p className="text-xs text-muted">{label}</p>
    </div>
)

const OWNER_USER: PublicProfileUser = {
    id: "u_baophamgia",
    fullName: "Phạm Gia Bảo",
    handle: "baophamgia",
    roleTitle: "Kỹ sư Backend cấp cao",
    bio: "8 năm xây hệ thống backend quy mô lớn. Thích viết về Kubernetes và kiến trúc sự kiện.",
    location: "Đà Nẵng, Việt Nam",
    workMode: "hybrid",
    rank: 2,
    followersCount: 1240,
    badges: [
        { id: "badge-1", label: "Người cố vấn hàng đầu" },
        { id: "badge-2", label: "Đã xác minh" },
    ],
    joinedAt: "2022-03-14T00:00:00.000Z",
    social: {
        github: "https://github.com/baophamgia",
        linkedin: "https://linkedin.com/in/baophamgia",
        website: "https://baophamgia.dev",
    },
    openToWork: true,
    sectionVisibility: { projects: true, challenges: true, skills: false, activity: true },
}

const LOCKED_USER: PublicProfileUser = {
    id: "u_locked",
    fullName: "Minh Trần",
    handle: "minh.tran",
    roleTitle: "Backend Engineer",
    bio: "Học DevOps Mastery, đang làm capstone container hoá.",
    location: "Đà Nẵng, Việt Nam",
    followersCount: 8,
    joinedAt: "2025-03-01T00:00:00.000Z",
    profileLocked: true,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the outer flush stack pinning the tab strip above the two-column body, then (nested) the column-first-becomes-row switch holding identity beside content", storyId: "frames-stack-stackv--default" },
    "Container": { tier: "frame", role: "the wide content measure the two-column body sits inside", storyId: "frames-container-container--default" },
    "ProfileTabsBar": { tier: "block", role: "the route strip, mounted as chrome above the body (the real app registers this same node onto the global Navbar's bottom layer instead — see file header)", storyId: "starci-blocks-navigation-profiletabsbar-profiletabsbar--owner-view" },
    "ProfileHero": { tier: "block", role: "the identity sidebar beside the active tab's own content", storyId: "starci-blocks-profile-profilehero-profilehero--default" },
    "ProfileNotFoundState": { tier: "block", role: "the whole-route 404-style message when the profile cannot be read", storyId: "starci-blocks-profile-profilenotfoundstate-profilenotfoundstate--default" },
    "ProfileLockedState": { tier: "block", role: "the non-owner view of a profile its owner has locked — identity stays, tabbed activity is withheld", storyId: "starci-blocks-profile-profilelockedstate-profilelockedstate--default" },
    "ProfileLoadingState": { tier: "block", role: "the first-load skeleton mirroring the real shell (tab strip, identity column, overview sections) so nothing jumps on resolve", storyId: "starci-blocks-profile-profileloadingstate-profileloadingstate--default" },
}

/** LEAF — the first-load skeleton, before the profile read has settled. */
export const Loading: Story = {
    render: () => (
        <BlockAnatomy
            name="PublicProfileLayout"
            tier="screen"
            leaf="Loading"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isLoading = true",
                    why: "The profile read is still in flight (first load, or the bare `/profile` route waiting for the signed-in viewer to hydrate before it knows which username to canonicalize to). The whole switch resolves to the loading branch alone — no tabs, no identity, no route panel underneath it yet.",
                    code: `<PublicProfileLayout
    isLoading
    user={null}
    isSelf={false}
    hasPublicCv={false}
    activeTab="overview"
    onTabChange={goTab}
    following={false}
    isFollowPending={false}
    onToggleFollow={toggleFollow}
    onEditProfile={editProfile}
    onHire={openHireFlow}
    onShare={shareProfile}
    onGoHome={goHome}
    onGoCourses={goCourses}
>
    {routePanel}
</PublicProfileLayout>`,
                    render: (
                        <PublicProfileLayout
                            showAnatomy
                            anatPart="PublicProfileLayout"
                            isLoading
                            user={null}
                            isSelf={false}
                            hasPublicCv={false}
                            activeTab="overview"
                            onTabChange={() => {}}
                            following={false}
                            isFollowPending={false}
                            onToggleFollow={() => {}}
                            onEditProfile={() => {}}
                            onHire={() => {}}
                            onShare={() => {}}
                            onGoHome={() => {}}
                            onGoCourses={() => {}}
                        >
                            <RouteContent label="Never reached — the loading branch replaces the whole body." />
                        </PublicProfileLayout>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — the read settled with nothing found. */
export const NotFound: Story = {
    render: () => (
        <BlockAnatomy
            name="PublicProfileLayout"
            tier="screen"
            leaf="Not found"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isLoading = false, user = null",
                    why: "The read has SETTLED (no longer loading, no longer validating) and resolved to nothing — deleted, never existed, or a failed fetch that stopped retrying. This layout owns the fixed \"Không tìm thấy hồ sơ\" copy itself (see file header); the caller only wires `onGoHome`.",
                    code: `<PublicProfileLayout
    isLoading={false}
    user={null}
    isSelf={false}
    hasPublicCv={false}
    activeTab="overview"
    onTabChange={goTab}
    following={false}
    isFollowPending={false}
    onToggleFollow={toggleFollow}
    onEditProfile={editProfile}
    onHire={openHireFlow}
    onShare={shareProfile}
    onGoHome={goHome}
    onGoCourses={goCourses}
>
    {routePanel}
</PublicProfileLayout>`,
                    render: (
                        <PublicProfileLayout
                            showAnatomy
                            anatPart="PublicProfileLayout"
                            isLoading={false}
                            user={null}
                            isSelf={false}
                            hasPublicCv={false}
                            activeTab="overview"
                            onTabChange={() => {}}
                            following={false}
                            isFollowPending={false}
                            onToggleFollow={() => {}}
                            onEditProfile={() => {}}
                            onHire={() => {}}
                            onShare={() => {}}
                            onGoHome={() => {}}
                            onGoCourses={() => {}}
                        >
                            <RouteContent label="Never reached — the not-found branch replaces the whole body." />
                        </PublicProfileLayout>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — the owner locked this profile and the viewer is not the owner. */
export const Locked: Story = {
    render: () => (
        <BlockAnatomy
            name="PublicProfileLayout"
            tier="screen"
            leaf="Locked"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "user.profileLocked = true, isSelf = false",
                    why: "A visitor lands on a profile its owner has locked. `profileLocked` only bites a VISITOR — the owner viewing their own locked profile falls through to the ordinary `Content` leaf instead (this is `isSelf` in the switch condition, not a separate prop). The whole body becomes `ProfileLockedState`: identity stays, tabbed activity is withheld.",
                    code: `<PublicProfileLayout
    isLoading={false}
    user={lockedUser}
    isSelf={false}
    hasPublicCv={false}
    activeTab="overview"
    onTabChange={goTab}
    following={false}
    isFollowPending={false}
    onToggleFollow={toggleFollow}
    onEditProfile={editProfile}
    onHire={openHireFlow}
    onShare={shareProfile}
    onGoHome={goHome}
    onGoCourses={goCourses}
>
    {routePanel}
</PublicProfileLayout>`,
                    render: (
                        <PublicProfileLayout
                            showAnatomy
                            anatPart="PublicProfileLayout"
                            isLoading={false}
                            user={LOCKED_USER}
                            isSelf={false}
                            hasPublicCv={false}
                            activeTab="overview"
                            onTabChange={() => {}}
                            following={false}
                            isFollowPending={false}
                            onToggleFollow={() => {}}
                            onEditProfile={() => {}}
                            onHire={() => {}}
                            onShare={() => {}}
                            onGoHome={() => {}}
                            onGoCourses={() => {}}
                        >
                            <RouteContent label="Never reached — the locked branch replaces the whole body." />
                        </PublicProfileLayout>
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — the real shape: tab strip chrome above a two-column identity + route-panel body. */
export const Content: Story = {
    render: () => (
        <BlockAnatomy
            name="PublicProfileLayout"
            tier="screen"
            leaf="Tabs + identity + route panel"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "owner view — skills tab hidden from visitors",
                    why: "The signed-in viewer IS this profile (`isSelf`), so every tab shows — including \"Skills\", which the owner switched off for everyone else, marked \"· ẩn\" so they remember it's private. `visibleTabs`/`hiddenTabs` are computed HERE from `sectionVisibility` (see file header), never passed in raw.",
                    code: `<PublicProfileLayout
    isLoading={false}
    user={ownerUser}
    isSelf
    hasPublicCv
    activeTab="overview"
    onTabChange={goTab}
    following={false}
    isFollowPending={false}
    onToggleFollow={toggleFollow}
    onEditProfile={editProfile}
    onHire={openHireFlow}
    onShare={shareProfile}
    onGoHome={goHome}
    onGoCourses={goCourses}
>
    <OverviewTabPanel />
</PublicProfileLayout>`,
                    render: (
                        <PublicProfileLayout
                            showAnatomy
                            anatPart="PublicProfileLayout"
                            isLoading={false}
                            user={OWNER_USER}
                            isSelf
                            hasPublicCv
                            activeTab="overview"
                            onTabChange={() => {}}
                            following={false}
                            isFollowPending={false}
                            onToggleFollow={() => {}}
                            onEditProfile={() => {}}
                            onHire={() => {}}
                            onShare={() => {}}
                            onGoHome={() => {}}
                            onGoCourses={() => {}}
                        >
                            <RouteContent label="Overview tab panel — a real nested route, rendered by its own page." />
                        </PublicProfileLayout>
                    ),
                },
                {
                    name: "visitor view, recruiter — canHire",
                    why: "A signed-out-of-ownership visitor: the \"Skills\" tab the owner hid never reaches `visibleTabs` at all (no marker, it simply is not one of the keys). This same person also opted into hiring (`openToWork`) and exposed a GitHub link, so this layout's own `canHire` computation flips `ProfileHero`'s primary CTA to \"Thuê tôi\" instead of follow — a DATA fork inside this leaf, not a new tree shape.",
                    code: `<PublicProfileLayout
    isLoading={false}
    user={ownerUser}
    isSelf={false}
    hasPublicCv
    activeTab="challenges"
    onTabChange={goTab}
    following={false}
    isFollowPending={false}
    onToggleFollow={toggleFollow}
    onEditProfile={editProfile}
    onHire={openHireFlow}
    onShare={shareProfile}
    onGoHome={goHome}
    onGoCourses={goCourses}
>
    <ChallengesTabPanel />
</PublicProfileLayout>`,
                    render: (
                        <PublicProfileLayout
                            isLoading={false}
                            user={OWNER_USER}
                            isSelf={false}
                            hasPublicCv
                            activeTab="challenges"
                            onTabChange={() => {}}
                            following={false}
                            isFollowPending={false}
                            onToggleFollow={() => {}}
                            onEditProfile={() => {}}
                            onHire={() => {}}
                            onShare={() => {}}
                            onGoHome={() => {}}
                            onGoCourses={() => {}}
                        >
                            <RouteContent label="Challenges tab panel — a real nested route, rendered by its own page." />
                        </PublicProfileLayout>
                    ),
                },
            ]}
        />
    ),
}
