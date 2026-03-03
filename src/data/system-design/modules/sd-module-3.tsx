import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule3: Module = {
    id: "sd-module-3",
    name: "Communication Patterns",
    description: "Các pattern giao tiếp phổ biến giữa services trong hệ thống Microservices",
    video: "",
    duration: "~2 hours",
    order: 3,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>API Gateway Pattern: 1 cổng vào cho client, routing và auth cơ bản</li>
                    <li>Backend for Frontend (BFF): tách backend theo từng loại client (web/mobile)</li>
                    <li>Service-to-Service: giao tiếp giữa services bằng REST vs gRPC</li>
                    <li>Event-Driven Architecture: dùng Kafka để xử lý bất đồng bộ</li>
                    <li>Publish–Subscribe: publish event, nhiều consumer xử lý song song</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết chọn đúng cách giao tiếp giữa services theo từng bài toán</li>
                    <li>Hiểu khi nào nên dùng sync (REST/gRPC) và khi nào nên dùng async (Kafka)</li>
                    <li>Nắm được vai trò của API Gateway và BFF trong hệ thống thực tế</li>
                    <li>Hiểu Pub/Sub hoạt động ra sao và áp dụng được cho các flow phổ biến</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể thiết kế luồng giao tiếp giữa các services
                    một cách rõ ràng và hợp lý, tránh lỗi “gọi nhau lung tung” và sẵn sàng bước vào
                    các pattern về dữ liệu và consistency ở module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
