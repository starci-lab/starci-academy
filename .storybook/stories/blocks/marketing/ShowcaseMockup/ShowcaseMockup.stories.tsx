import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShowcaseMockup, SHOWCASE_THEMES } from "./ShowcaseMockup"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ShowcaseMockup> = {
    title: "Design/Marketing/ShowcaseMockup",
    component: ShowcaseMockup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ShowcaseMockup>

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "chuỗi URL trên thanh address (type=code)" },
    ],
    reason:
        "Khung cửa sổ trình duyệt tái dùng (3 chấm + address bar) bọc bất kỳ nội dung nào, nghiêng 3D + quầng sáng màu — cái look hero StarCi/Uni-Education gói thành một block. Feature chỉ đổi theme/tilt/backdrop/url + children; surface card luôn theo token light/dark.",
}

/** Sample content inside the mockup — a condensed course list. */
const DemoContent = () => (
    <div className="flex flex-col gap-2 p-4">
        <span className="text-sm font-semibold text-foreground">Khoá học nổi bật</span>
        <div className="flex flex-col gap-1 text-xs text-muted">
            <span>Fullstack Mastery — 128 học viên đang học</span>
            <span>System Design Mastery — 64 học viên đang học</span>
            <span>DevOps Mastery — 41 học viên đang học</span>
        </div>
    </div>
)

export const Default: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/khoa-hoc">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const ThemeStarci: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/kien-truc" theme={SHOWCASE_THEMES.starci}>
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const ThemeAqua: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="uni-education.vn/demo" theme={SHOWCASE_THEMES.aqua}>
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const TiltRight: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/lo-trinh" tilt="right">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const TiltNone: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/gia" tilt="none">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const BackdropGrid: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/tai-lieu" backdrop="grid">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const BackdropStars: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/cong-dong" backdrop="stars">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const BackdropNone: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/lien-he" backdrop="none">
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const AspectVideo: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup url="starci.edu.vn/preview" aspect="video">
                    <div className="flex size-full items-center justify-center bg-surface-2 text-xs text-muted">
                        Ảnh chụp toàn trang web
                    </div>
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}

export const NoAddressBar: Story = {
    render: () =>
        blockShell(
            <div className="max-w-lg">
                <ShowcaseMockup>
                    <DemoContent />
                </ShowcaseMockup>
            </div>,
            ANATOMY,
        ),
}
