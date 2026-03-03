import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule9: Module = {
    id: "fs-module-9",
    name: "ReactJS Foundations & Project Setup",
    description: "Làm quen React + TypeScript, cấu trúc project theo feature, routing, component pattern và cách frontend giao tiếp với backend API… Xây nền tảng vững chắc trước khi đi sâu hơn.",
    video: "",
    duration: "~3 hours",
    order: 9,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây dựng nền tảng frontend React có cấu trúc rõ ràng,
                    sẵn sàng tích hợp với backend đã xây ở các phần trước.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Setup React + TypeScript (Vite hoặc Next.js tùy cấu hình dự án)</li>
                    <li>Tổ chức cấu trúc folder theo feature để dễ mở rộng và maintain</li>
                    <li>Hiểu component model: props, state, event handling, conditional rendering</li>
                    <li>Thiết kế routing và layout pattern cho dashboard</li>
                    <li>Kết nối backend API: fetch/axios, xử lý loading và error cơ bản</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Tự khởi tạo được một frontend project có cấu trúc rõ ràng</li>
                    <li>Biết cách xây dựng màn hình và tích hợp API đúng flow</li>
                    <li>Hiểu cách tổ chức component để tránh rối khi dự án lớn dần</li>
                    <li>Sẵn sàng bước vào phần hooks và data layer nâng cao</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể tạo một nền tảng frontend React
                    có cấu trúc rõ ràng, dễ mở rộng và sẵn sàng cho các production patterns phía sau.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
