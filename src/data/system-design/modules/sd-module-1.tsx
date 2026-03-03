import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule1: Module = {
    id: "sd-module-1",
    name: "Fundamentals of System Design",
    description: "Nền tảng về System Design: scalability, reliability, availability, consistency. Hiểu các khái niệm cơ bản và metrics quan trọng trong thiết kế hệ thống.",
    video: "",
    duration: "~2 hours",
    order: 1,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn xây dựng nền tảng vững chắc về System Design,
                    hiểu các khái niệm cốt lõi và metrics quan trọng.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu các khái niệm cơ bản: scalability, reliability, availability, consistency</li>
                    <li>Nắm vững các metrics quan trọng: latency, throughput, CAP theorem</li>
                    <li>Phân biệt vertical scaling vs horizontal scaling</li>
                    <li>Hiểu các trade-offs trong thiết kế hệ thống</li>
                    <li>Làm quen với quy trình thiết kế hệ thống từ requirements đến implementation</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Có nền tảng vững chắc về các khái niệm System Design</li>
                    <li>Biết cách đánh giá và so sánh các giải pháp thiết kế</li>
                    <li>Hiểu các trade-offs và biết cách đưa ra quyết định phù hợp</li>
                    <li>Sẵn sàng bước vào phần thiết kế hệ thống cụ thể</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có nền tảng vững chắc về System Design,
                    sẵn sàng để thiết kế các hệ thống phức tạp trong các module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
