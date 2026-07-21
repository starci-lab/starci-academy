import type { Meta, StoryObj } from "@storybook/nextjs"

import { ShowcaseMockup, SHOWCASE_THEMES } from "@/components/blocks/marketing/ShowcaseMockup"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ShowcaseMockup> = {
    title: "Blocks/Marketing/ShowcaseMockup",
    component: ShowcaseMockup,
}

export default meta

type Story = StoryObj<typeof ShowcaseMockup>

/** Nội dung mẫu bên trong khung mockup — một danh sách khoá học rút gọn. */
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

/**
 * Toàn bộ variant của ShowcaseMockup trong một gallery: 3 bộ màu glow, 3 hướng
 * nghiêng, 4 kiểu nền trang trí, khung tỉ lệ 16:9, và trạng thái ẩn address bar.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so trực tiếp các bộ màu, hướng nghiêng và kiểu nền của ShowcaseMockup trước khi chọn tổ hợp cho một khu vực landing cụ thể.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Bộ màu accent đơn sắc, nghiêng trái, nền quầng sáng — dùng khi chưa cần đồng bộ màu với khu vực xung quanh."
            >
                <ShowcaseMockup url="starci.edu.vn/khoa-hoc">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Bộ màu StarCi"
                hint="Ba màu hồng/vàng/xanh khớp với sơ đồ kiến trúc — dùng khi mockup đứng cạnh ArchitectureScene để đồng bộ bảng màu."
            >
                <ShowcaseMockup url="starci.edu.vn/kien-truc" theme={SHOWCASE_THEMES.starci}>
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Bộ màu Aqua"
                hint="Ba màu xanh dương/xanh ngọc/tím kiểu Uni-Education — dùng cho khu vực mang phong cách sản phẩm giáo dục cổ điển hơn."
            >
                <ShowcaseMockup url="uni-education.vn/demo" theme={SHOWCASE_THEMES.aqua}>
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Nghiêng phải"
                hint="Nghiêng ngược hướng mặc định — dùng khi mockup nằm bên trái khối text, để mắt người đọc dồn vào nội dung bên phải."
            >
                <ShowcaseMockup url="starci.edu.vn/lo-trinh" tilt="right">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Không nghiêng"
                hint="Đứng thẳng, không xoay 3D — dùng khi đặt mockup giữa trang hoặc xếp nhiều mockup cạnh nhau trong một lưới."
            >
                <ShowcaseMockup url="starci.edu.vn/gia" tilt="none">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Nền lưới điểm"
                hint="Nền chấm lưới tĩnh thay cho quầng sáng gradient — dùng khi khu vực muốn cảm giác kỹ thuật, tối giản hơn."
            >
                <ShowcaseMockup url="starci.edu.vn/tai-lieu" backdrop="grid">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Nền sao"
                hint="Các đốm sáng nhỏ rải quanh mockup — dùng cho khu vực nền tối, gợi không gian thay vì quầng sáng liền mạch."
            >
                <ShowcaseMockup url="starci.edu.vn/cong-dong" backdrop="stars">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Không nền trang trí"
                hint="Bỏ hẳn lớp trang trí phía sau — dùng khi khu vực đặt mockup đã có hoa văn/nền riêng, tránh chồng lớp rối mắt."
            >
                <ShowcaseMockup url="starci.edu.vn/lien-he" backdrop="none">
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Khoá tỉ lệ 16:9"
                hint="Khung nội dung cố định theo tỉ lệ video — dùng khi children là ảnh chụp toàn trang web thay vì nội dung co giãn tự do."
            >
                <ShowcaseMockup url="starci.edu.vn/preview" aspect="video">
                    <div className="flex size-full items-center justify-center bg-surface-2 text-xs text-muted">
                        Ảnh chụp toàn trang web
                    </div>
                </ShowcaseMockup>
            </Variant>
            <Variant
                label="Không có address bar"
                hint="Ẩn chuỗi URL giả, chỉ giữ 3 chấm màu của thanh chrome — dùng khi không cần gợi ý địa chỉ trang cụ thể."
            >
                <ShowcaseMockup>
                    <DemoContent />
                </ShowcaseMockup>
            </Variant>
        </Gallery>
    ),
}
