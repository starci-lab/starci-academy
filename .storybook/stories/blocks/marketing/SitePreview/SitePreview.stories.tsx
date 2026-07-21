import type { Meta, StoryObj } from "@storybook/nextjs"

import { SitePreview } from "@/components/blocks/marketing/SitePreview"
import { ShowcaseMockup } from "@/components/blocks/marketing/ShowcaseMockup"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SitePreview> = {
    title: "Blocks/Marketing/SitePreview",
    component: SitePreview,
}

export default meta

type Story = StoryObj<typeof SitePreview>

/**
 * SitePreview không nhận prop nào — luôn render đúng một bố cục cố định (nav app +
 * sidebar bộ lọc + list khoá học minh hoạ). Gallery so sánh hai cách bọc: đứng riêng
 * trong khung có chiều cao cố định (vì component tự lấp đầy chiều cao cha) và trong
 * bối cảnh thật — lồng bên trong ShowcaseMockup aspect="video" như trên landing page.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem SitePreview đứng riêng và trong bối cảnh thật ShowcaseMockup — chọn đúng cách bọc khi ghép vào section landing hoặc marketing.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đứng riêng"
                hint="Dùng khi cần soi bố cục SitePreview độc lập — component tự lấp đầy chiều cao cha (h-full) nên phải bọc trong một khung có chiều cao cố định."
            >
                <div className="h-[360px] w-full max-w-3xl overflow-hidden rounded-3xl border border-default">
                    <SitePreview />
                </div>
            </Variant>
            <Variant
                label="Trong ShowcaseMockup (bối cảnh thật)"
                hint="Cách dùng thật trên landing page: lồng SitePreview trong ShowcaseMockup với aspect='video' để có khung cửa sổ trình duyệt cùng hiệu ứng nghiêng 3D."
            >
                <ShowcaseMockup url="starci.vn/khoa-hoc" aspect="video" className="max-w-3xl">
                    <SitePreview />
                </ShowcaseMockup>
            </Variant>
        </Gallery>
    ),
}
