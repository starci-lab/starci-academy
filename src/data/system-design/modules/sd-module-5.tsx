import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule5: Module = {
    id: "sd-module-5",
    name: "Scalability & Performance Patterns",
    description: "Các pattern giúp hệ thống chịu tải tốt và chạy nhanh hơn khi traffic tăng",
    video: "",
    duration: "~2 hours",
    order: 5,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Scalability là gì? Khi traffic tăng thì hệ thống “đứt” ở đâu</li>
                    <li>Horizontal scaling: scale service bằng cách tăng replicas</li>
                    <li>Load Balancer: phân phối request đều giữa nhiều instance</li>
                    <li>Caching cơ bản: cache để giảm tải DB và tăng tốc đọc</li>
                    <li>Read replica: tách read ra để hệ thống chịu tải tốt hơn</li>
                    <li>Sharding/Partitioning: chia dữ liệu để tránh “1 DB gánh hết”</li>
                    <li>Rate limiting: chặn spam và bảo vệ hệ thống khi quá tải</li>
                    <li>CDN (ở mức khái niệm): tăng tốc nội dung tĩnh cho người dùng</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết cách scale service khi lượng người dùng tăng</li>
                    <li>Hiểu vì sao cache và read replica giúp hệ thống nhanh và rẻ hơn</li>
                    <li>Biết khi nào nên chia dữ liệu (shard/partition) và trade-off cơ bản</li>
                    <li>Biết cách bảo vệ hệ thống bằng rate limiting khi gặp traffic bất thường</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn có thể chọn và kết hợp các pattern scale/performance
                    để hệ thống chạy ổn khi traffic tăng, sẵn sàng bước sang phần reliability/resilience
                    ở module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
