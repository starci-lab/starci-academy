import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule4: Module = {
    id: "fs-module-4",
    name: "Authentication & Authorization (JWT + RBAC)",
    description: "Triển khai authentication với JWT (access/refresh token), Guards, Role-based access control; tích hợp OAuth2 (Google); bảo mật API theo best practices.",
    video: "",
    duration: "~2 hours",
    order: 4,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây dựng hệ thống xác thực và phân quyền an toàn,
                    rõ ràng và phù hợp với môi trường production.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Triển khai JWT (access token / refresh token) theo flow thực tế</li>
                    <li>Xây dựng Guards và cơ chế phân quyền RBAC (role-based access control)</li>
                    <li>Thiết kế chiến lược refresh token (rotation / revoke) hợp lý</li>
                    <li>Tích hợp OAuth2 (Google) cho login nhanh và tiện lợi</li>
                    <li>Chuẩn hóa xử lý auth error để frontend tích hợp ổn định</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách xây dựng authentication production-ready</li>
                    <li>Thiết kế hệ thống phân quyền rõ ràng theo role và permission</li>
                    <li>Biết cách bảo vệ API đúng cách thay vì chỉ kiểm tra token đơn giản</li>
                    <li>Tự tin triển khai hệ thống đăng nhập cho dự án thực tế</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể tự xây dựng hệ thống đăng nhập
                    và phân quyền hoàn chỉnh, đảm bảo bảo mật và sẵn sàng tích hợp vào sản phẩm thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
