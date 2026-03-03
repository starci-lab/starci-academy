import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule13: Module = {
    id: "fs-module-13",
    name: "Capstone Project (Fullstack Production Simulation)",
    description: "Xây dựng hệ thống fullstack hoàn chỉnh: authentication, CRUD, caching, realtime, queue, dashboard frontend và cấu trúc sẵn sàng triển khai production.",
    video: "",
    duration: "10 hours",
    order: 13,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Đây là module tổng hợp, nơi bạn ghép tất cả kỹ năng đã học thành một sản phẩm fullstack hoàn chỉnh.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Xây một hệ thống fullstack end-to-end theo mô phỏng production</li>
                    <li>Backend: auth + CRUD + caching + realtime + queue/background jobs</li>
                    <li>Frontend: dashboard quản trị, data layer, form system, realtime updates</li>
                    <li>Chuẩn hóa cấu trúc source code, config, logging và quy ước team</li>
                    <li>Đóng gói project để sẵn sàng deploy (deployment-ready structure)</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Có một sản phẩm fullstack hoàn chỉnh để đưa vào portfolio</li>
                    <li>Hiểu flow build sản phẩm thực tế từ backend đến frontend</li>
                    <li>Biết cách tổ chức dự án để dễ maintain và mở rộng</li>
                    <li>Tự tin tham gia dự án production với tư duy hệ thống</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn sở hữu một capstone fullstack “ra sản phẩm”,
                    thể hiện được kiến trúc, chất lượng code và quy trình triển khai gần với môi trường thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
