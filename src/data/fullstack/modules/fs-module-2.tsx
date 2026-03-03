import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule2: Module = {
    id: "fs-module-2",
    name: "Database Integration, ORM/ODM & Caching",
    description: "Tích hợp PostgreSQL với TypeORM và MongoDB với Mongoose; thiết kế schema, relation, indexing; triển khai caching Redis và tối ưu performance.",
    video: "",
    duration: "~3 hours",
    order: 2,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn hiểu và làm chủ tầng dữ liệu của hệ thống backend.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Kết nối PostgreSQL với TypeORM và MongoDB với Mongoose</li>
                    <li>Thiết kế schema, quan hệ (relations) và chiến lược indexing hợp lý</li>
                    <li>Hiểu transaction và cách tối ưu truy vấn cơ bản</li>
                    <li>Tích hợp Redis để caching và giảm tải database</li>
                    <li>Phân biệt rõ khi nào nên sử dụng SQL và khi nào nên dùng NoSQL</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết kế được cấu trúc database rõ ràng và dễ mở rộng</li>
                    <li>Biết cách tối ưu truy vấn thay vì chỉ tập trung vào việc “chạy được”</li>
                    <li>Hiểu vai trò của caching trong việc cải thiện hiệu năng hệ thống</li>
                    <li>Tự tin tích hợp nhiều loại database trong cùng một dự án</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể thiết kế và triển khai tầng dữ liệu
                    cho backend một cách có tổ chức, tối ưu hiệu năng và phù hợp với môi trường production.
                </div>
                <Spacer y={2}/>
                <Link size="sm" color="primary" underline="always">Đọc thêm</Link>
            </div>
        </div>
    ),
}
