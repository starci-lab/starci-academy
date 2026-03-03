import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule11: Module = {
    id: "fs-module-11",
    name: "UI System & Design Practice",
    description: "Làm việc với UI library hiện đại, xây dựng dashboard layout, table, form và các UI states theo hướng production-ready.",
    video: "",
    duration: "~2 hours",
    order: 11,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây dựng giao diện dashboard có cấu trúc,
                    đồng bộ và sẵn sàng cho sản phẩm thực tế.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Làm việc với UI library hiện đại (ví dụ: HeroUI) để build UI nhanh và đồng bộ</li>
                    <li>Xây layout dashboard: sidebar / header, responsive, page layout</li>
                    <li>Sử dụng table, pagination, filter/search, empty & loading states</li>
                    <li>Thiết kế modal / drawer, confirm dialogs, toast / notification</li>
                    <li>Tạo form UI component và chuẩn hóa UI states như ứng dụng thực tế</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Tự build được admin dashboard UI nhìn “ra sản phẩm”</li>
                    <li>Biết cách tổ chức UI components để tái sử dụng</li>
                    <li>Hiểu cách chuẩn hóa UI states cho toàn hệ thống</li>
                    <li>Không bị “kẹt UI” khi làm capstone fullstack</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể dựng UI dashboard hoàn chỉnh,
                    đồng bộ và sẵn sàng tích hợp sâu với backend.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
