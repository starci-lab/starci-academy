import { Course, PricingPhase } from "@/types"
import { Link, Spacer } from "@heroui/react"
import React from "react"


export const data: Array<Course> = [
    {
        id: "fullstack",
        name: "Fullstack Mastery",
        description: "Khóa học dành cho học sinh và sinh viên muốn tích lũy tư duy, kiến thức và kỹ năng cần thiết để có thể đi thực tập hoặc làm việc ở vị trí Fresher/Junior Developer. Chương trình bao quát đầy đủ kiến thức Fullstack với tất cả các khái niệm cơ bản từ frontend đến backend, giúp bạn hiểu nền tảng và có thể bắt đầu làm việc thực tế.",
        image: "/fullstack.png",
        commitmentTexts: [
            "Chương trình 2 tháng, tập trung vào nền tảng và tư duy tự học.",
            "Sở hữu capstone fullstack hoàn chỉnh để đưa vào portfolio.",
            "Được hỗ trợ trong trong quá trình học và làm project."
        ],
        price: 100,
        location: "Location 1",
        originalPrice: 1499000,
        pricing: [
            {
                phase: PricingPhase.Pioneer,
                price: 999000,
                name: "Pioneer",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 20,
                slotSold: 0,
            },
            {
                phase: PricingPhase.EarlyBird,
                price: 1249000,
                name: "Early Bird",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 50,
                slotSold: 0,
            },
            {
                phase: PricingPhase.Regular,
                price: 1499000,
                name: "Regular",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: Infinity,
                slotSold: 0,
            },
        ],
        currentPhase: PricingPhase.Pioneer,
        date: "2021-01-01",
        time: "10:00",
        duration: "1 hour",
        modules: [
            {
                id: "fs-module-1",
                name: "Backend Environment & NestJS Foundations",
                description:
                    "Thiết lập môi trường Node.js, cài đặt NestJS, hiểu Dependency Injection, Module System, Request Lifecycle, và xây dựng project structure chuẩn production.",
                video: "",
                duration: "~2 hours",
                order: 1,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
      Đây là module nền tảng giúp bạn xây backend đúng hướng ngay từ đầu.
                            </div>
                            <Spacer y={2} />
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Thiết lập môi trường Node.js + NestJS chuẩn cho development và production</li>
                                <li>Hiểu rõ Dependency Injection và module system trong NestJS</li>
                                <li>Nắm được vòng đời xử lý của một HTTP request</li>
                                <li>Tổ chức project theo cấu trúc rõ ràng, dễ mở rộng và bảo trì</li>
                                <li>Chuẩn hóa env config, logging và base response format</li>
                            </ul>
                        </div>
                        <div>
                            <div>
      Sau module này, bạn sẽ:
                            </div>
                            <Spacer y={2} />
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu cách NestJS vận hành thay vì chỉ sử dụng theo ví dụ</li>
                                <li>Biết cách khởi tạo project có cấu trúc rõ ràng</li>
                                <li>Tự tin mở rộng dự án mà không làm rối codebase</li>
                                <li>Có nền tảng vững để triển khai các module nâng cao phía sau</li>
                            </ul>
                        </div>
                        <div>
                            <div>
      Cam kết:
                            </div>
                            <Spacer y={2} />
                            <div className="text-foreground-500">
      Sau khi hoàn tất module này, bạn có thể tự thiết kế và triển khai một backend NestJS
      có cấu trúc rõ ràng, sẵn sàng mở rộng và phù hợp với môi trường production thực tế.
                            </div>
                            <Spacer y={2}/>
                            <Link size="sm" color="primary" underline="always">Đọc thêm</Link>
                        </div>
                    </div>
                ),
            },
            {
                id: "fs-module-2",
                name: "Database Integration, ORM/ODM & Caching",
                description:
                    "Tích hợp PostgreSQL với TypeORM và MongoDB với Mongoose; thiết kế schema, relation, indexing; triển khai caching Redis và tối ưu performance.",
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
            },
            {
                id: "fs-module-3",
                name: "REST API Development & API Documentation",
                description:
                    "Xây dựng RESTful API chuẩn CRUD; DTO, Validation, Exception Filter, Interceptor; chuẩn hóa response format; cấu hình Swagger cho team collaboration.",
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
            },
            {
                id: "fs-module-4",
                name: "Authentication & Authorization (JWT + RBAC)",
                description:
                    "Triển khai authentication với JWT (access/refresh token), Guards, Role-based access control; tích hợp OAuth2 (Google); bảo mật API theo best practices.",
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
            },
            {
                id: "fs-module-5",
                name: "WebSocket & Real-time Communication",
                description:
                  "Xây dựng hệ thống realtime có cấu trúc với WebSocket và Socket.IO.",
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
            },
            {
                id: "fs-module-6",
                name: "Cron Jobs, Queue & Background Processing",
                description:
                  "Xây dựng hệ thống cron jobs, queue và background processing có cấu trúc với NestJS.",
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
            },

            {
                id: "fs-module-7",
                name: "System Architecture, Clean Code & Backend Security",
                description:
                  "Thiết kế layered architecture; logging (Winston), environment config, validation strategy; tích hợp các nguyên tắc bảo mật và production mindset.",
                video: "",
                duration: "~3 hours",
                order: 7,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
                        Module này giúp bạn nhìn backend như một hệ thống hoàn chỉnh —
                        có kiến trúc, có logging và có kiểm soát bảo mật,
                        thay vì chỉ là tập hợp các file controller và service.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Thiết kế layered architecture (controller / service / repository / domain) rõ ràng</li>
                                <li>Chuẩn hóa environment config và validation để tránh lỗi runtime</li>
                                <li>Thiết lập logging (Winston), trace context cơ bản và guideline log</li>
                                <li>Áp dụng clean code: naming, boundaries, error handling, separation of concerns</li>
                                <li>Tích hợp các nguyên tắc bảo mật cơ bản: input validation, rate limit, bảo vệ API</li>
                                <li>Xây dựng production mindset: maintain, debug, observability và khả năng mở rộng</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tư duy như một backend engineer thay vì chỉ “code chạy được”</li>
                                <li>Biết cách tổ chức hệ thống lớn mà không bị rối khi thêm feature mới</li>
                                <li>Hiểu vai trò của logging, config và security trong môi trường production</li>
                                <li>Có nền tảng để team làm việc đồng bộ và maintain lâu dài</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn có thể thiết kế backend có kiến trúc rõ ràng,
                        có logging chuẩn, có kiểm soát bảo mật cơ bản và sẵn sàng vận hành trong môi trường thực tế.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            },

            {
                id: "fs-module-8",
                name: "Docker & Deployment to Digital Ocean VPS",
                description:
                  "Xây dựng Docker image cho backend NestJS, thiết lập docker-compose, và triển khai ứng dụng lên VPS Digital Ocean một cách đơn giản và hiệu quả.",
                video: "",
                duration: "~2 hours",
                order: 8,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
                        Module này giúp bạn containerize backend và triển khai lên VPS thực tế,
                        thay vì chỉ chạy trên localhost.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu Docker cơ bản: image, container, Dockerfile và docker-compose</li>
                                <li>Xây dựng Dockerfile cho NestJS application: multi-stage build, tối ưu image size</li>
                                <li>Thiết lập docker-compose để chạy backend + database + Redis cùng lúc</li>
                                <li>Triển khai lên Digital Ocean VPS: tạo droplet, cấu hình SSH, cài đặt Docker</li>
                                <li>Thiết lập domain, reverse proxy với Nginx và cấu hình SSL cơ bản</li>
                                <li>Quản lý environment variables và secrets trên production</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết cách đóng gói ứng dụng backend thành Docker image</li>
                                <li>Tự triển khai được backend lên VPS và truy cập từ internet</li>
                                <li>Hiểu cách quản lý nhiều service (app, database, cache) với docker-compose</li>
                                <li>Tự tin deploy backend production-ready lên server thực tế</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn có thể containerize và triển khai backend
                        lên VPS một cách đơn giản, sẵn sàng cho môi trường production thực tế.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            },

            // ---- FRONTEND PART ----

            {
                id: "fs-module-9",
                name: "ReactJS Foundations & Project Setup",
                description:
                  "Làm quen React + TypeScript, cấu trúc project theo feature, routing, component pattern và cách frontend giao tiếp với backend API… Xây nền tảng vững chắc trước khi đi sâu hơn.",
                video: "",
                duration: "~3 hours",
                order: 9,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
                        Module này giúp bạn xây dựng nền tảng frontend React có cấu trúc rõ ràng,
                        sẵn sàng tích hợp với backend đã xây ở các phần trước.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Setup React + TypeScript (Vite hoặc Next.js tùy cấu hình dự án)</li>
                                <li>Tổ chức cấu trúc folder theo feature để dễ mở rộng và maintain</li>
                                <li>Hiểu component model: props, state, event handling, conditional rendering</li>
                                <li>Thiết kế routing và layout pattern cho dashboard</li>
                                <li>Kết nối backend API: fetch/axios, xử lý loading và error cơ bản</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tự khởi tạo được một frontend project có cấu trúc rõ ràng</li>
                                <li>Biết cách xây dựng màn hình và tích hợp API đúng flow</li>
                                <li>Hiểu cách tổ chức component để tránh rối khi dự án lớn dần</li>
                                <li>Sẵn sàng bước vào phần hooks và data layer nâng cao</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn có thể tạo một nền tảng frontend React
                        có cấu trúc rõ ràng, dễ mở rộng và sẵn sàng cho các production patterns phía sau.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            },
            {
                id: "fs-module-10",
                name: "React Hooks, Component Architecture & State Management",
                description:
                  "Hiểu và vận dụng hooks (state, effect, memo…), xây custom hooks, tách logic khỏi UI; tổ chức component maintainable và quản lý state toàn cục với Context/Redux theo đúng use-case.",
                video: "",
                duration: "~2 hours",
                order: 10,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
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
                            <div className="font-medium">
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
                            <div className="font-medium">
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
            },
            {
                id: "fs-module-11",
                name: "UI System & Design Practice",
                description:
                  "Làm việc với UI library hiện đại, xây dựng dashboard layout, table, form và các UI states theo hướng production-ready.",
                video: "",
                duration: "~2 hours",
                order: 11,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
                        Module này giúp bạn xây dựng giao diện dashboard có cấu trúc,
                        đồng bộ và sẵn sàng cho sản phẩm thực tế.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Làm việc với UI library hiện đại (ví dụ: HeroUI) để build UI nhanh và đồng bộ</li>
                                <li>Xây layout dashboard: sidebar / header, responsive, page layout</li>
                                <li>Sử dụng table, pagination, filter/search, empty & loading states</li>
                                <li>Thiết kế modal / drawer, confirm dialogs, toast / notification</li>
                                <li>Tạo form UI component và chuẩn hóa UI states như ứng dụng thực tế</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tự build được admin dashboard UI nhìn “ra sản phẩm”</li>
                                <li>Biết cách tổ chức UI components để tái sử dụng</li>
                                <li>Hiểu cách chuẩn hóa UI states cho toàn hệ thống</li>
                                <li>Không bị “kẹt UI” khi làm capstone fullstack</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn có thể dựng UI dashboard hoàn chỉnh,
                        đồng bộ và sẵn sàng tích hợp sâu với backend.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            },
            {
                id: "fs-module-12",
                name: "Frontend Production Patterns & Deploy to Vercel",
                description:
                  "Ứng dụng các thư viện phổ biến để quản lý data, form, date/time, formatting… Tổ chức frontend theo hướng production-ready, tách business logic khỏi UI, tối ưu trải nghiệm người dùng và triển khai lên Vercel.",
                video: "",
                duration: "~3 hours",
                order: 12,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
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
                            <div className="font-medium">
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
                            <div className="font-medium">
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
            },
            {
                id: "fs-module-13",
                name: "Capstone Project (Fullstack Production Simulation)",
                description:
                  "Xây dựng hệ thống fullstack hoàn chỉnh: authentication, CRUD, caching, realtime, queue, dashboard frontend và cấu trúc sẵn sàng triển khai production.",
                video: "",
                duration: "10 hours",
                order: 13,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div className="font-medium">
                        Đây là module tổng hợp, nơi bạn ghép tất cả kỹ năng đã học thành một sản phẩm fullstack hoàn chỉnh.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Xây một hệ thống fullstack end-to-end theo mô phỏng production</li>
                                <li>Backend: auth + CRUD + caching + realtime + queue/background jobs</li>
                                <li>Frontend: dashboard quản trị, data layer, form system, realtime updates</li>
                                <li>Chuẩn hóa cấu trúc source code, config, logging và quy ước team</li>
                                <li>Đóng gói project để sẵn sàng deploy (deployment-ready structure)</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Có một sản phẩm fullstack hoàn chỉnh để đưa vào portfolio</li>
                                <li>Hiểu flow build sản phẩm thực tế từ backend đến frontend</li>
                                <li>Biết cách tổ chức dự án để dễ maintain và mở rộng</li>
                                <li>Tự tin tham gia dự án production với tư duy hệ thống</li>
                            </ul>
                        </div>
              
                        <div>
                            <div className="font-medium">
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn sở hữu một capstone fullstack “ra sản phẩm”,
                        thể hiện được kiến trúc, chất lượng code và quy trình triển khai gần với môi trường thực tế.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            },
        ],
    },
    {
        id: "system-design",
        name: "Khóa System Design",
        description: "Camp 1 description",
        image: "https://via.placeholder.com/150",
        price: 100,
        location: "Location 1",
        date: "2021-01-01",
        time: "10:00",
        duration: "1 hour",
        modules: [
            {
                id: "module-1",
                name: "Module 1",
                description: "Module 1 description",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 1,
            }
        ]
    },
    {
        id: "devops-cloud",
        name: "Khóa DevOps & Cloud",
        description: "Camp 1 description",
        image: "https://via.placeholder.com/150",
        price: 100,
        location: "Location 1",
        date: "2021-01-01",
        time: "10:00",
        duration: "1 hour",
        modules: [
            {
                id: "module-1",
                name: "Module 1",
                description: "Module 1 description",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 1,
            }
        ]
    }
]
