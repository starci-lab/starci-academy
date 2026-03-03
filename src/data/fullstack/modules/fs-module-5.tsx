import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule5: Module = {
    id: "fs-module-5",
    name: "WebSocket & Real-time Communication",
    description: "Xây dựng hệ thống realtime có cấu trúc với WebSocket và Socket.IO.",
    video: "",
    duration: "~2 hours",
    order: 5,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây hệ thống realtime rõ ràng và có tổ chức,
                    thay vì chỉ “emit event cho chạy”.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Xây dựng WebSocket Gateway với Socket.IO trong NestJS</li>
                    <li>Thiết kế event structure và quản lý rooms / namespaces hợp lý</li>
                    <li>Xác thực socket thông qua token handshake</li>
                    <li>Triển khai các luồng realtime như notification, live update, presence</li>
                    <li>
                                        Hiểu Socket.IO Adapter (cơ chế rooms/broadcast) và giới thiệu Redis Adapter
                                        khi cần chạy nhiều instance
                                    </li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách backend và frontend giao tiếp realtime</li>
                    <li>Tự thiết kế được event và flow xử lý realtime rõ ràng</li>
                    <li>Biết cách quản lý kết nối và tránh các lỗi phổ biến như leak connection</li>
                    <li>Hiểu rooms/broadcast hoạt động như thế nào và khi nào cần adapter</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể triển khai tính năng realtime
                    cho hệ thống của mình một cách rõ ràng, ổn định và dễ mở rộng về sau.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
