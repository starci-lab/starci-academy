"use client"

import {
    BracketsCurlyIcon,
    CardsIcon,
    ChatsCircleIcon,
    GraduationCapIcon,
    MapPinLineIcon,
    MicrophoneStageIcon,
    StackIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import type {
    LearnNavItem,
} from "../types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { SidebarTab, setSidebar } from "@/redux/slices/sidebar"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"
import { useLeaderboardSwr } from "@/components/features/learn/Leaderboard/useLeaderboardSwr"

/**
 * Result of {@link useSidebarNavItems}.
 */
export interface UseSidebarNavItemsResult {
    /** Ordered nav entries for the course-learn sidebar. */
    items: Array<LearnNavItem>
    /** Currently active sidebar tab (for row highlighting). */
    selectedTab: SidebarTab
    /** Fired with the chosen entry: switches tab then routes to its URL. */
    onSelect: (item: LearnNavItem) => void
}

/**
 * Builds the course-learn sidebar nav entries plus the select handler.
 *
 * Shared by the desktop {@link import("../LearnSidebar").LearnSidebar} and the
 * mobile drawer ({@link import("../LearnMobileBar").LearnMobileBar}) so both render
 * the exact same items + routing without duplicating the redux/route wiring.
 * @returns {@link UseSidebarNavItemsResult} entries, active tab, and select callback.
 */
export const useSidebarNavItems = (): UseSidebarNavItemsResult => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    // course catalog drives the module-count label on the "modules" row
    const course = useAppSelector((state) => state.course.entity)
    // display id is the slug used to build every learn sub-route
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // active tab from redux highlights the matching row
    const selectedSidebar = useAppSelector((state) => state.sidebar.sidebar)
    // enrollment drives the lock badge on hands-on rows; only lock once the status is KNOWN
    // (enrolled defaults false → would flash a lock on enrolled viewers otherwise).
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const locked = (Boolean(enrollmentSwr.data) || Boolean(enrollmentSwr.error)) && !enrolled

    // primary-key course id drives the status badges (due-card count, viewer rank)
    const courseId = useAppSelector((state) => state.course.id)
    // due-flashcard count → badge on the "Ôn tập" row (only when > 0)
    const dueSwr = useQueryMyDueFlashcardsSwr(courseId ?? undefined)
    const dueCount = dueSwr.data?.dueCount ?? 0
    // viewer's course rank → badge on the "Bảng xếp hạng" row (only when ranked)
    const leaderboardSwr = useLeaderboardSwr()
    const myRank = leaderboardSwr.data?.myRank?.rank ?? null

    /** Record the active sidebar tab in Redux (routing is handled in {@link onSelect}). */
    const onSelectSidebarTab = useCallback(
        (tab: SidebarTab) => {
            dispatch(setSidebar({ tab, extraId: undefined }))
        },
        [dispatch],
    )

    // build the ordered nav entries, grouped by ROLE (path → practice → track);
    // memoized so rows keep stable identity
    const items = useMemo<Array<LearnNavItem>>(
        () => [
            // ── Lộ trình (the mandatory spine: content → capstone) ──
            {
                label: t("modules.title", { count: course?.modules?.length ?? 0 }),
                value: "modules",
                tab: SidebarTab.Modules,
                icon: BracketsCurlyIcon,
                group: "path",
                // route to the course-contents index (the docs-style "chỉ mục" landing);
                // selecting a lesson there drills into its module/content route.
                url: pathConfig().locale(locale).course(courseDisplayId).learn().content().build(),
            },
            {
                label: t("finalProject.title"),
                value: "personal-project",
                tab: SidebarTab.PersonalProject,
                icon: GraduationCapIcon,
                group: "path",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build(),
                locked,
            },
            // ── Ôn & luyện (aids orbiting the spine) ──
            {
                label: t("flashcard.title"),
                value: "flashcards",
                tab: SidebarTab.Flashcards,
                icon: CardsIcon,
                group: "practice",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().flashcards().build(),
                // due-card nudge — only when there's something to review
                badge: dueCount > 0 ? { tone: "due", value: dueCount } : undefined,
            },
            {
                label: t("mockInterview.navLabel"),
                value: "mock-interview",
                tab: SidebarTab.MockInterview,
                icon: MicrophoneStageIcon,
                group: "practice",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().mockInterview().build(),
                // enrolled-only (spends AI credits) — mirror the personal-project lock
                locked,
            },
            {
                label: t("foundations.title"),
                value: "foundations",
                tab: SidebarTab.Foundations,
                icon: StackIcon,
                group: "practice",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().foundations().build(),
            },
            // ── Theo dõi (orientation + motivation) ──
            {
                label: t("mindMap.title"),
                value: "mind-map",
                tab: SidebarTab.MindMap,
                icon: MapPinLineIcon,
                group: "track",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().mindMap().build(),
            },
            {
                label: t("leaderboard.title"),
                value: "leaderboard",
                tab: SidebarTab.Leaderboard,
                icon: UsersIcon,
                group: "track",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().leaderboard().build(),
                // rank nudge — only when the viewer is ranked on this course
                badge: myRank !== null ? { tone: "rank", value: myRank } : undefined,
            },
            {
                label: t("courseQa.navLabel"),
                value: "qa",
                tab: SidebarTab.CourseQa,
                icon: ChatsCircleIcon,
                group: "track",
                url: pathConfig().locale(locale).course(courseDisplayId).learn().qa().build(),
            },
        ],
        [
            course?.modules?.length,
            courseDisplayId,
            dueCount,
            locale,
            locked,
            myRank,
            t,
        ],
    )

    /** Route on selection: update Redux tab, then navigate once to the row URL. */
    const onSelect = useCallback(
        (item: LearnNavItem) => {
            onSelectSidebarTab(item.tab)
            if (!item.url) {
                return
            }
            router.push(item.url)
        },
        [
            onSelectSidebarTab,
            router,
        ],
    )

    return {
        items,
        selectedTab: selectedSidebar.tab,
        onSelect,
    }
}
