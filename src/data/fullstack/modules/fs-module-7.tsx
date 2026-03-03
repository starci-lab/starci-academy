import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule7: Module = {
    id: "fs-module-7",
    name: "System Architecture, Clean Code & Backend Security",
    description: "Thiết kế layered architecture; logging (Winston), environment config, validation strategy; tích hợp các nguyên tắc bảo mật và production mindset.",
    video: "",
    duration: "~3 hours",
    order: 7,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn nhìn backend như một hệ thống hoàn chỉnh —
                    có kiến trúc, có logging và có kiểm soát bảo mật,
                    thay vì chỉ là tập hợp các file controller và service.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết kế layered architecture (controller / service / repository / domain) rõ ràng</li>
                    <li>Chuẩn hóa environment config và validation để tránh lỗi runtime</li>
                    <li>Thiết lập logging (Winston), trace context cơ bản và guideline log</li>
                    <li>Áp dụng clean code: naming, boundaries, error handling, separation of concerns</li>
                    <li>Tích hợp các nguyên tắc bảo mật cơ bản: input validation, rate limit, bảo vệ API</li>
                    <li>Xây dựng production mindset: maintain, debug, observability và khả năng mở rộng</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Tư duy như một backend engineer thay vì chỉ "code chạy được"</li>
                    <li>Biết cách tổ chức hệ thống lớn mà không bị rối khi thêm feature mới</li>
                    <li>Hiểu vai trò của logging, config và security trong môi trường production</li>
                    <li>Có nền tảng để team làm việc đồng bộ và maintain lâu dài</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể thiết kế backend có kiến trúc rõ ràng,
                    có logging chuẩn, có kiểm soát bảo mật cơ bản và sẵn sàng vận hành trong môi trường thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
