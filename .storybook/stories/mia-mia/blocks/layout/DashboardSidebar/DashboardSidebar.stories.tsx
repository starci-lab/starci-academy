import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    ExamIcon,
    BookOpenIcon,
    TextAaIcon,
    GameControllerIcon,
    TrophyIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { Chip, Label, Typography } from "@heroui/react"
import { DashboardSidebar } from "@sb-components/mia-mia/blocks/layout/DashboardSidebar"
import type { DashboardNavGroup } from "@sb-components/mia-mia/blocks/layout/DashboardSidebar"

const meta: Meta<typeof DashboardSidebar> = {
    title: "MiaMia/DashboardSidebar",
    component: DashboardSidebar,
}
export default meta
type Story = StoryObj<typeof DashboardSidebar>

/** The mia-mia learner nav, modelled the way the connected layout feeds it. */
const GROUPS: Array<DashboardNavGroup> = [
    {
        key: "learn",
        label: "Learn",
        items: [
            { key: "home", href: "/vi/dashboard", label: "Home", icon: <HouseIcon className="size-5" /> },
            { key: "exam", href: "/vi/exam", label: "Exams", icon: <ExamIcon className="size-5" /> },
            { key: "vocab", href: "/vi/learn", label: "Vocabulary", icon: <BookOpenIcon className="size-5" /> },
            { key: "grammar", href: "/vi/learn/grammar", label: "Topics and grammar", icon: <TextAaIcon className="size-5" /> },
        ],
    },
    {
        key: "compete",
        label: "Compete",
        items: [
            {
                key: "play",
                href: "/vi/play",
                label: "Play together",
                icon: <GameControllerIcon className="size-5" />,
                endContent: <Chip size="sm" variant="soft" color="accent">4</Chip>,
            },
            { key: "ranks", href: "/vi/play/leaderboard", label: "Leaderboard", icon: <TrophyIcon className="size-5" /> },
        ],
    },
    {
        key: "you",
        items: [
            { key: "profile", href: "/vi/profile", label: "Profile", icon: <UserIcon className="size-5" /> },
        ],
    },
]

/** The full learner navigation, with the dashboard home as the active route. */
export const Default: Story = {
    parameters: { usage: "The learner's dashboard navigation — grouped destinations (learn, compete, you) that collapse into an icon rail; the current route gets the accent fill." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Dashboard sidebar</Label>
                <Typography type="body-sm" color="muted">
                    The learner navigation for mia-mia — exams, vocabulary, play together — collapsing into an icon rail.
                </Typography>
            </div>
            <div className="h-[34rem]">
                <DashboardSidebar
                    title="Mia Mia"
                    groups={GROUPS}
                    activeHref="/vi/dashboard"
                    onNavigate={() => {}}
                    collapseLabel="Collapse sidebar"
                    expandLabel="Expand sidebar"
                    storageKey="storybook-dashboard-sidebar-default"
                />
            </div>
        </div>
    ),
}

/** A deeper destination is active (Exams) and a group carries a trailing badge. */
export const OnExam: Story = {
    parameters: { usage: "A non-home destination is active — the exam catalogue — showing the highlight moving off the dashboard row and a game-count badge on the play row." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Active: Exams</Label>
                <Typography type="body-sm" color="muted">
                    The highlight follows the current route; only one row is filled at a time.
                </Typography>
            </div>
            <div className="h-[34rem]">
                <DashboardSidebar
                    title="Mia Mia"
                    groups={GROUPS}
                    activeHref="/vi/exam"
                    onNavigate={() => {}}
                    collapseLabel="Collapse sidebar"
                    expandLabel="Expand sidebar"
                    storageKey="storybook-dashboard-sidebar-exam"
                />
            </div>
        </div>
    ),
}
