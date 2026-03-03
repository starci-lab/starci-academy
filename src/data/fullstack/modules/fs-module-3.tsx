import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule3: Module = {
    id: "fs-module-3",
    name: "REST API Development & API Documentation",
    description: "Xây dựng RESTful API chuẩn CRUD; DTO, Validation, Exception Filter, Interceptor; chuẩn hóa response format; cấu hình Swagger cho team collaboration.",
    video: "",
    duration: "~2 hours",
    order: 3,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây dựng API rõ ràng, có cấu trúc và sẵn sàng cho môi trường thực tế.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Xây dựng RESTful API chuẩn CRUD theo best practices</li>
                    <li>Sử dụng DTO và validation để kiểm soát dữ liệu đầu vào</li>
                    <li>Triển khai Exception Filter và Interceptor để quản lý lỗi và response</li>
                    <li>Chuẩn hóa response format thống nhất toàn hệ thống</li>
                    <li>Cấu hình Swagger để tài liệu hóa API và hỗ trợ team collaboration</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết kế API rõ ràng, dễ mở rộng và dễ bảo trì</li>
                    <li>Không còn viết controller rời rạc, thiếu cấu trúc</li>
                    <li>Biết cách chuẩn hóa response và error handling cho frontend sử dụng ổn định</li>
                    <li>Tự tin xây dựng API có tài liệu đầy đủ cho team</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể tự xây dựng một REST API hoàn chỉnh,
                    có cấu trúc rõ ràng, tài liệu đầy đủ và sẵn sàng tích hợp vào dự án thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
