import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonalProjectGatePreview, type PersonalProjectGatePreviewTask } from "@sb-components/starci/blocks/learn/PersonalProjectGatePreview/PersonalProjectGatePreview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PersonalProjectGatePreview`: the capstone teaser dropped into
 * `EnrollGate`'s `preview` slot inside `LearnShell` — what a trial viewer sees
 * of the personal-project workspace, sitting behind the gate's own fade/lock.
 *
 * ⭐ THREE REUSED LEAVES, NO REBUILD: `ContinueCardHero` for the headline,
 * a STANDALONE `ProgressMeter` for the capstone's own completion (kept apart
 * from the hero card's own optional bar — see the component file's header),
 * and `SurfaceCard` called with `label` — the flat stand-in for the real app's
 * (unported) `LabeledCard`.
 *
 * ⛔ NON-INTERACTIVE: no press handler anywhere in the prop list. The fade/
 * lock affordance around this preview belongs to `EnrollGate`, not to this
 * block.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the headline, the meter, and the task rows
 * never change shape — how many tasks and what they're called are DATA, so
 * they stay a STATE inside one leaf rather than spawning a second one.
 */
const meta: Meta<typeof PersonalProjectGatePreview> = {
    title: "StarCi/Blocks/Learn/PersonalProjectGatePreview/PersonalProjectGatePreview",
    component: PersonalProjectGatePreview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PersonalProjectGatePreview>

const TASKS: Array<PersonalProjectGatePreviewTask> = [
    { title: "Khởi tạo repo + README" },
    { title: "Thiết kế schema cơ sở dữ liệu" },
    { title: "Dựng API xác thực người dùng" },
    { title: "Viết test cho luồng đăng ký" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ContinueCardHero": { tier: "block", role: "the capstone's own name + one-line pitch, as the single highlight card on this preview surface", storyId: "starci-blocks-learn-continuecard-hero-no-progress--not-started" },
    "ProgressMeter": { tier: "composite", role: "the capstone's overall completion — a separate meter from the hero card's own optional bar, see the component file header for why", storyId: "composites-stats-progressmeter--label-and-value" },
    "SurfaceCard": { tier: "composite", role: "the flat, namespace-free stand-in for the real app's `LabeledCard`, holding the milestone-0 task rows under its own section label", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical track separating the hero, the meter and the task card, or the vertical stack of task rows inside the card", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "one task row's horizontal track, holding the bullet mark beside its title", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "one task row's title text", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the capstone teaser. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PersonalProjectGatePreview"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "Dữ liệu thật",
                        why: "The headline names the actual capstone project, the meter shows real overall completion, and the task card lists milestone-0's real titles in order — the exact shape a trial viewer sees behind EnrollGate's fade.",
                        code: `<PersonalProjectGatePreview
    heroTitle="Nền tảng đặt lịch khám bệnh"
    heroSubtitle="Dự án cá nhân — xây một hệ thống đặt lịch end-to-end"
    progress={{ value: 15, max: 100, label: "Tiến độ dự án cá nhân" }}
    items={tasks}
/>`,
                        render: (
                            <PersonalProjectGatePreview
                                anatPart="PersonalProjectGatePreview"
                                showAnatomy
                                heroTitle="Nền tảng đặt lịch khám bệnh"
                                heroSubtitle="Dự án cá nhân — xây một hệ thống đặt lịch end-to-end"
                                progress={{ value: 15, max: 100, label: "Tiến độ dự án cá nhân" }}
                                items={TASKS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The hero card, the task card's label, and every task row's title switch to shimmer together — the same flag reaching straight into ContinueCardHero, SurfaceCard, and each row's Typography, with no separate skeleton tree built for this block.",
                        code: `<PersonalProjectGatePreview
    heroTitle="Nền tảng đặt lịch khám bệnh"
    heroSubtitle="Dự án cá nhân — xây một hệ thống đặt lịch end-to-end"
    progress={{ value: 15, max: 100, label: "Tiến độ dự án cá nhân" }}
    items={tasks}
    isSkeleton
/>`,
                        render: (
                            <PersonalProjectGatePreview
                                heroTitle="Nền tảng đặt lịch khám bệnh"
                                heroSubtitle="Dự án cá nhân — xây một hệ thống đặt lịch end-to-end"
                                progress={{ value: 15, max: 100, label: "Tiến độ dự án cá nhân" }}
                                items={TASKS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
