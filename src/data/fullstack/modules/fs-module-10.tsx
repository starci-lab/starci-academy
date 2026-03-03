import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule10: Module = {
    id: "fs-module-10",
    name: "React Hooks, Component Architecture & State Management",
    description: "Hiểu và vận dụng hooks (state, effect, memo…), xây custom hooks, tách logic khỏi UI; tổ chức component maintainable và quản lý state toàn cục với Context/Redux theo đúng use-case.",
    video: "",
    duration: "~2 hours",
    order: 10,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn viết React có cấu trúc và kiểm soát,
                    tách logic khỏi UI và quản lý state rõ ràng khi dự án bắt đầu phức tạp.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Nắm vững hooks cốt lõi: useState, useEffect, useMemo, useCallback, useRef</li>
                    <li>Hiểu và tránh các bug phổ biến: stale closure, dependency array sai, rerender không kiểm soát</li>
                    <li>Xây custom hooks để tái sử dụng logic (auth, pagination, debounce…)</li>
                    <li>Tách business logic khỏi UI theo pattern dễ maintain</li>
                    <li>Thiết kế component boundaries: container / presentational, composition pattern</li>
                    <li>Quản lý global state với Context API: tạo &quot;singleton hook&quot; cho app state (Provider + custom hook)</li>
                    <li>Giới thiệu Redux (Redux Toolkit): khi nào nên dùng, store/slice/actions và cách tổ chức state hợp lý</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Viết React có tư duy hệ thống, không còn ghép logic vào UI một cách lộn xộn</li>
                    <li>Biết cách kiểm soát render và tối ưu trải nghiệm người dùng</li>
                    <li>Tự tin refactor code frontend khi dự án bắt đầu lớn</li>
                    <li>Hiểu cách tổ chức component để dễ mở rộng và maintain lâu dài</li>
                    <li>Biết khi nào dùng Context và khi nào cần Redux để quản lý state toàn cục</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể xây component và custom hooks theo cấu trúc rõ ràng,
                    đồng thời quản lý state toàn cục bằng Context/Redux một cách hợp lý để ứng dụng ổn định và dễ mở rộng.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
