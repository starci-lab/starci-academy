import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule12: Module = {
    id: "fs-module-12",
    name: "Frontend Production Patterns & Deploy to Vercel",
    description: "Ứng dụng các thư viện phổ biến để quản lý data, form, date/time, formatting… Tổ chức frontend theo hướng production-ready, tách business logic khỏi UI, tối ưu trải nghiệm người dùng và triển khai lên Vercel.",
    video: "",
    duration: "~3 hours",
    order: 12,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn tổ chức frontend theo hướng production-ready:
                    có data layer, form system và utilities rõ ràng, đồng thời triển khai lên Vercel
                    để sẵn sàng cho người dùng truy cập từ internet.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>
                        Xây data layer theo hướng production (SWR): caching, revalidation, mutation,
                        optimistic update, pagination / infinite…
                    </li>
                    <li>
                        Quản lý form chuẩn chỉnh (Formik + Yup): validation schema, async submit,
                        error mapping từ backend, reusable form patterns…
                    </li>
                    <li>
                        Chuẩn hóa date/time và number formatting (dayjs + numeraljs): timezone-safe,
                        currency/percent, relative time…
                    </li>
                    <li>Tách business logic khỏi UI bằng utility/service layer để code sạch và dễ maintain</li>
                    <li>Thiết kế error handling và loading states đồng bộ cho toàn app</li>
                    <li>Hiểu Vercel platform: JAMstack, serverless functions và edge network</li>
                    <li>Kết nối GitHub repository với Vercel và thiết lập auto-deployment</li>
                    <li>Cấu hình build settings: framework preset, build command và output directory</li>
                    <li>Thiết lập environment variables cho development, preview và production</li>
                    <li>Kết nối custom domain và cấu hình SSL tự động</li>
                    <li>Tối ưu performance: image optimization, caching và CDN</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Không chỉ &quot;dùng thư viện&quot; mà biết cách tổ chức chúng thành một hệ thống frontend có kiến trúc</li>
                    <li>Hiểu cách tối ưu trải nghiệm người dùng với caching và optimistic UI</li>
                    <li>Biết cách chuẩn hóa form và xử lý lỗi để app ổn định hơn</li>
                    <li>Viết frontend dễ mở rộng, dễ maintain và ít bug hơn</li>
                    <li>Biết cách deploy frontend React lên Vercel chỉ trong vài phút</li>
                    <li>Tự thiết lập được CI/CD pipeline đơn giản với GitHub integration</li>
                    <li>Tự tin triển khai frontend production-ready lên internet</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể xây một frontend production-ready,
                    có data layer + form system + utilities được tổ chức rõ ràng và triển khai
                    lên Vercel một cách đơn giản, sẵn sàng cho người dùng truy cập từ mọi nơi.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
