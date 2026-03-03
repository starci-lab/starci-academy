import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule1: Module = {
    id: "fs-module-1",
    name: "Backend Environment & NestJS Foundations",
    description: "Thiết lập môi trường Node.js, cài đặt NestJS, hiểu Dependency Injection, Module System, Request Lifecycle, và xây dựng project structure chuẩn production.",
    video: "",
    duration: "~2 hours",
    order: 1,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Đây là module nền tảng giúp bạn xây backend đúng hướng ngay từ đầu.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết lập môi trường Node.js + NestJS chuẩn cho development và production</li>
                    <li>Hiểu rõ Dependency Injection và module system trong NestJS</li>
                    <li>Nắm được vòng đời xử lý của một HTTP request</li>
                    <li>Tổ chức project theo cấu trúc rõ ràng, dễ mở rộng và bảo trì</li>
                    <li>Chuẩn hóa env config, logging và base response format</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách NestJS vận hành thay vì chỉ sử dụng theo ví dụ</li>
                    <li>Biết cách khởi tạo project có cấu trúc rõ ràng</li>
                    <li>Tự tin mở rộng dự án mà không làm rối codebase</li>
                    <li>Có nền tảng vững để triển khai các module nâng cao phía sau</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể tự thiết kế và triển khai một backend NestJS
                    có cấu trúc rõ ràng, sẵn sàng mở rộng và phù hợp với môi trường production thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">Đọc thêm</Link>
            </div>
        </div>
    ),
}
