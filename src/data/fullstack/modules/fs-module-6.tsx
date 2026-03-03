import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule6: Module = {
    id: "fs-module-6",
    name: "Cron Jobs, Queue & Background Processing",
    description: "Xây dựng hệ thống cron jobs, queue và background processing có cấu trúc với NestJS.",
    video: "",
    duration: "~2 hours",
    order: 6,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xử lý các tác vụ nền một cách ổn định và có kiểm soát,
                    thay vì nhồi mọi thứ vào request.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết lập cron jobs với @nestjs/schedule cho các tác vụ định kỳ</li>
                    <li>Sử dụng BullMQ + Redis để xây hệ thống queue và background jobs</li>
                    <li>Thiết kế retry strategy, backoff và dead-letter queue</li>
                    <li>Thiết kế job payload, idempotency và xử lý lỗi đúng cách</li>
                    <li>Quan sát và theo dõi job: trạng thái, lỗi, retry và các tín hiệu vận hành cơ bản</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết cách tách xử lý nặng khỏi request để API ổn định hơn</li>
                    <li>Xây được hệ thống job chạy nền có retry và kiểm soát lỗi</li>
                    <li>Hiểu khi nào nên dùng cron, khi nào nên dùng queue, và khi nào cần event-driven</li>
                    <li>Tự tin triển khai background processing cho dự án thực tế</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể xây dựng hệ thống xử lý tác vụ nền
                    rõ ràng, ổn định và dễ vận hành, giúp backend tăng độ tin cậy trong môi trường thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
