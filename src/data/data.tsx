import { Course, PricingPhase } from "@/types"
import { Link, Spacer } from "@heroui/react"
import React from "react"


export const data: Array<Course> = [
    {
        id: "fullstack",
        name: "Fullstack Mastery",
        description: "Khóa học dành cho học sinh và sinh viên muốn tích lũy tư duy, kiến thức và kỹ năng cần thiết để có thể đi thực tập hoặc làm việc ở vị trí Fresher/Junior Developer. Chương trình bao quát đầy đủ kiến thức Fullstack với tất cả các khái niệm cơ bản từ frontend đến backend, giúp bạn hiểu nền tảng và có thể bắt đầu làm việc thực tế.",
        image: "/fullstack-mastery.png",
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
        name: "System Design Mastery",
        description: "Khóa học dành cho developers muốn nâng cao kỹ năng thiết kế hệ thống, hiểu sâu về kiến trúc phân tán, scalability, và các pattern phổ biến trong thực tế. Chương trình giúp bạn tự tin tham gia các cuộc phỏng vấn System Design và có khả năng thiết kế hệ thống production-ready.",
        image: "/system-design-mastery.png",
        commitmentTexts: [
            "Chương trình tập trung vào tư duy và kỹ năng thiết kế hệ thống thực tế.",
            "Thực hành thiết kế các hệ thống phổ biến: social network, video streaming, e-commerce...",
            "Được hỗ trợ review design và nhận feedback từ mentor có kinh nghiệm."
        ],
        price: 100,
        location: "Location 1",
        originalPrice: 1999000,
        pricing: [
            {
                phase: PricingPhase.Pioneer,
                price: 1299000,
                name: "Pioneer",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 15,
                slotSold: 0,
            },
            {
                phase: PricingPhase.EarlyBird,
                price: 1599000,
                name: "Early Bird",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 30,
                slotSold: 0,
            },
            {
                phase: PricingPhase.Regular,
                price: 1999000,
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
            },
            {
                id: "sd-module-2",
                name: "Microservices & Kubernetes Fundamentals",
                description: "Giới thiệu Microservices và Kubernetes ở mức nền tảng",
                video: "",
                duration: "~2 hours",
                order: 2,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Microservices là gì? So sánh với kiến trúc Monolith</li>
                                <li>Tại sao hệ thống lớn lại cần chia nhỏ thành nhiều service</li>
                                <li>Ưu và nhược điểm của kiến trúc Microservices</li>
                                <li>Kubernetes là gì và giải quyết vấn đề gì trong vận hành</li>
                                <li>Các khái niệm cơ bản trong k8s: Pod, Deployment, Service</li>
                                <li>Cách Microservices và Kubernetes phối hợp với nhau trong thực tế</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu rõ tư duy thiết kế hệ thống theo hướng chia nhỏ service</li>
                                <li>Biết khi nào nên dùng Microservices thay vì Monolith</li>
                                <li>Nắm được vai trò của Kubernetes trong việc quản lý và scale hệ thống</li>
                                <li>Có nền tảng để triển khai các hệ thống phân tán ở mức cơ bản</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn hiểu được cách các hệ thống hiện đại
                        được chia nhỏ và vận hành trong production, sẵn sàng bước vào các
                        bài thiết kế và triển khai thực tế ở các module tiếp theo.
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
            },
            {
                id: "sd-module-4",
                name: "Data & Consistency Patterns",
                description: "Các pattern dữ liệu và consistency khi hệ thống có nhiều services",
                video: "",
                duration: "~2 hours",
                order: 4,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Database per Service: mỗi service quản lý dữ liệu của mình</li>
                                <li>Consistency là gì? Strong vs Eventual (hiểu ở mức đơn giản)</li>
                                <li>Vì sao distributed transaction khó và không nên “join DB” giữa services</li>
                                <li>Saga Pattern: xử lý nhiều bước (đặt hàng → thanh toán → trừ kho)</li>
                                <li>CQRS: tách read và write để dễ scale và tối ưu</li>
                                <li>Cache Aside: tăng tốc đọc dữ liệu với cache</li>
                                <li>Idempotency: xử lý retry mà không bị double charge / double create</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu cách tổ chức dữ liệu khi có nhiều services</li>
                                <li>Biết vì sao hệ thống phân tán thường chấp nhận eventual consistency</li>
                                <li>Biết áp dụng Saga để tránh lỗi “lỗi giữa chừng” trong flow nhiều bước</li>
                                <li>Nắm được tư duy CQRS và cache để tối ưu hiệu năng ở mức cơ bản</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Kết thúc module này, bạn hiểu được cách các hệ thống microservices xử lý dữ liệu
                        và consistency trong thực tế, đủ nền tảng để tiếp tục sang phần scale/performance
                        và reliability ở các module tiếp theo.
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
            },
            {
                id: "sd-module-6",
                name: "Reliability & Resilience Patterns",
                description: "Các pattern giúp hệ thống chịu lỗi tốt và không sập dây chuyền.",
                video: "",
                duration: "~2 hours",
                order: 6,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>Module này bao gồm:</div>
                            <Spacer y={2} />
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Failure là bình thường trong distributed system</li>
                                <li>Timeout: tránh “đợi vô hạn” làm nghẽn hệ thống</li>
                                <li>Retry + backoff: retry đúng cách để không làm tình hình tệ hơn</li>
                                <li>Circuit Breaker: ngăn lỗi lan dây chuyền</li>
                                <li>Bulkhead: cô lập tài nguyên để tránh sập toàn hệ</li>
                                <li>Health checks: liveness/readiness để tự hồi phục</li>
                                <li>Graceful degradation: giảm tính năng nhưng vẫn sống</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Sau module này, bạn sẽ:</div>
                            <Spacer y={2} />
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết thiết kế hệ thống “chịu lỗi” thay vì chỉ “chạy được”</li>
                                <li>Biết dùng timeout/retry/circuit breaker đúng tình huống</li>
                                <li>Hiểu cách tránh lỗi cascade làm sập hệ thống</li>
                                <li>Biết các nguyên tắc vận hành để hệ thống ổn định hơn</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Cam kết:</div>
                            <Spacer y={2} />
                            <div className="text-foreground-500">
                        Kết thúc module, bạn có tư duy và toolkit cơ bản để thiết kế hệ thống ổn định,
                        chịu lỗi tốt trong môi trường production.
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
                id: "sd-module-7",
                name: "Monitoring & Observability",
                description: "Theo dõi hệ thống để phát hiện lỗi sớm và debug nhanh trong production",
                video: "",
                duration: "~2 hours",
                order: 7,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Monitoring vs Observability: khác nhau ở mức ý tưởng</li>
                                <li>3 trụ cột: Logs, Metrics, Traces (hiểu đơn giản và dễ áp dụng)</li>
                                <li>Các metrics quan trọng: latency, throughput, error rate</li>
                                <li>Golden Signals (SRE): 4 tín hiệu để biết hệ thống “đang ổn hay không”</li>
                                <li>Centralized logging: gom log về một chỗ để dễ tìm và debug</li>
                                <li>Distributed tracing: theo dõi một request đi qua nhiều services</li>
                                <li>Health check & alerting: báo động khi có vấn đề trước khi user than</li>
                                <li>Dashboard cơ bản: nhìn là biết service nào đang “đỏ”</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết theo dõi hệ thống bằng logs/metrics ở mức cơ bản</li>
                                <li>Biết chọn metrics quan trọng để đo “sức khỏe” của service</li>
                                <li>Hiểu tracing giúp debug hệ microservices nhanh hơn như thế nào</li>
                                <li>Biết cách thiết kế alerting để phát hiện lỗi sớm</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Kết thúc module này, bạn có thể tự xây một “bộ quan sát” cơ bản cho hệ thống:
                        biết đo, biết theo dõi, biết cảnh báo và biết debug — đủ để vận hành các hệ
                        microservices một cách tự tin hơn trong production.
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
                id: "sd-module-8",
                name: "System Security & Infrastructure Protection",
                description: "Bảo vệ hệ thống ở mức production: network, key management và access control",
                video: "",
                duration: "~2 hours",
                order: 8,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Security trong distributed system: vì sao production luôn phải assume “zero trust”</li>
                                <li>Key Management: API keys, JWT secrets, encryption keys</li>
                                <li>Secrets management: env vs K8s Secret vs Vault (ở mức khái niệm)</li>
                                <li>Firewall & Network isolation: chặn traffic không cần thiết</li>
                                <li>VPC & private network (hiểu cách cô lập service nội bộ)</li>
                                <li>Service-to-service authentication (mTLS ở mức tư duy)</li>
                                <li>Role-Based Access Control (RBAC) trong hệ thống</li>
                                <li>Nguyên tắc least privilege và separation of concerns</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu vì sao security phải thiết kế từ đầu, không phải vá sau</li>
                                <li>Biết cách quản lý secrets và keys an toàn hơn</li>
                                <li>Hiểu network isolation giúp giảm rủi ro ra sao</li>
                                <li>Có tư duy production-level security khi thiết kế hệ thống</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Kết thúc module này, bạn có nền tảng bảo vệ hệ thống ở mức infrastructure —
                        hiểu cách quản lý key, cô lập network và kiểm soát quyền truy cập để hệ
                        thống không chỉ “chạy được” mà còn “chạy an toàn” trong production.
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
                id: "sd-module-9",
                name: "System Design Case Study",
                description: "Áp dụng toàn bộ kiến thức để thiết kế một hệ thống production hoàn chỉnh",
                video: "",
                duration: "~3 hours",
                order: 9,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Phân tích requirements: functional vs non-functional</li>
                                <li>Thiết kế high-level architecture (microservices + gateway)</li>
                                <li>Thiết kế communication flow (sync vs async)</li>
                                <li>Thiết kế database & consistency strategy</li>
                                <li>Áp dụng caching, read replica, scaling strategy</li>
                                <li>Xử lý failure: retry, circuit breaker, graceful degradation</li>
                                <li>Monitoring & alerting cho production</li>
                                <li>Security: auth, key management, network isolation</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Case study thực hành:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Design E-commerce System</li>
                                <li>Design Chat Application</li>
                                <li>Design Payment System</li>
                                <li>Design Real-time Notification System</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết cách bắt đầu một bài System Design từ con số 0</li>
                                <li>Biết trình bày kiến trúc logic và có cấu trúc</li>
                                <li>Biết chọn trade-off phù hợp với requirement</li>
                                <li>Có template tư duy để tự luyện các bài design khác</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Kết thúc module này, bạn có khả năng thiết kế và giải thích một hệ thống
                        production hoàn chỉnh, từ architecture đến scale, reliability,
                        monitoring và security — đủ nền tảng cho project thực tế hoặc interview.
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
                id: "sd-module-10",
                name: "Advanced Topics",
                description: "Các chủ đề nâng cao thường gặp khi build hệ thống production",
                video: "",
                duration: "~3 hours",
                order: 10,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này bao gồm:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>SSO (Single Sign-On): đăng nhập 1 lần cho nhiều hệ thống/app</li>
                                <li>OAuth/OIDC (khái niệm): nền tảng phổ biến để triển khai SSO</li>
                                <li>Time-series DB là gì? Khi nào nên dùng (metrics, price, logs…)</li>
                                <li>So sánh nhanh TSDB vs relational DB trong use case thực tế</li>
                                <li>Service Discovery là gì? Tại sao microservices cần nó</li>
                                <li>Service Discovery trong k8s: Service name, DNS, load balancing nội bộ</li>
                                <li>Trade-offs & pitfalls phổ biến khi áp dụng các chủ đề nâng cao</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu SSO hoạt động ra sao và dùng khi nào</li>
                                <li>Biết nhận diện bài toán phù hợp cho time-series database</li>
                                <li>Hiểu service discovery giúp các service “tìm nhau” trong production</li>
                                <li>Biết các trade-offs cơ bản để chọn giải pháp phù hợp</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Kết thúc module này, bạn có thêm bộ “vũ khí nâng cao” để đọc kiến trúc production
                        dễ hơn và tự tin hơn khi gặp các bài toán hệ thống thực tế vượt khỏi mức cơ bản.
                            </div>
              
                            <Spacer y={2} />
              
                            <Link size="sm" color="primary" underline="always">
                        Đọc thêm
                            </Link>
                        </div>
                    </div>
                ),
            }            
        ],

    },
    {
        id: "devops-cloud",
        name: "DevOps & Cloud Mastery",
        description: "Khóa học dành cho developers muốn làm chủ DevOps và Cloud infrastructure. Học cách sử dụng Terraform để quản lý infrastructure as code, triển khai trên các cloud provider phổ biến (AWS, Digital Ocean, GCP), và xây dựng CI/CD pipeline với Jenkins, GitHub Actions và ArgoCD. Chương trình giúp bạn tự tin quản lý và vận hành hệ thống production trên cloud.",
        image: "/devops-cloud-mastery.png",
        commitmentTexts: [
            "Chương trình thực hành với các công cụ DevOps phổ biến trong thực tế.",
            "Thực hành triển khai infrastructure trên AWS, Digital Ocean và GCP.",
            "Xây dựng CI/CD pipeline hoàn chỉnh từ code đến production."
        ],
        price: 100,
        location: "Location 1",
        originalPrice: 2199000,
        pricing: [
            {
                phase: PricingPhase.Pioneer,
                price: 1499000,
                name: "Pioneer",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 15,
                slotSold: 0,
            },
            {
                phase: PricingPhase.EarlyBird,
                price: 1799000,
                name: "Early Bird",
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                slotAvailable: 30,
                slotSold: 0,
            },
            {
                phase: PricingPhase.Regular,
                price: 2199000,
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
                id: "devops-module-1",
                name: "Terraform Fundamentals & Infrastructure as Code",
                description: "Làm quen với Terraform, hiểu Infrastructure as Code (IaC), viết Terraform configuration để quản lý infrastructure một cách tự động và có thể tái sử dụng.",
                video: "",
                duration: "~3 hours",
                order: 1,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                        Module này giúp bạn làm chủ Terraform để quản lý infrastructure như code,
                        thay vì tạo tài nguyên thủ công trên cloud console.
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu Infrastructure as Code (IaC) và lợi ích của việc quản lý infrastructure bằng code</li>
                                <li>Cài đặt và cấu hình Terraform, hiểu cấu trúc file .tf</li>
                                <li>Viết Terraform configuration: providers, resources, variables, outputs</li>
                                <li>Sử dụng Terraform state để quản lý trạng thái infrastructure</li>
                                <li>Áp dụng best practices: modules, workspaces, remote state</li>
                                <li>Xử lý dependencies và lifecycle management trong Terraform</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Sau module này, bạn sẽ:
                            </div>
              
                            <Spacer y={2} />
              
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết cách viết Terraform configuration để tạo và quản lý infrastructure</li>
                                <li>Hiểu cách tổ chức Terraform code theo module để tái sử dụng</li>
                                <li>Tự tin quản lý infrastructure bằng code thay vì click trên console</li>
                                <li>Sẵn sàng áp dụng Terraform cho các cloud provider khác nhau</li>
                            </ul>
                        </div>
              
                        <div>
                            <div>
                        Cam kết:
                            </div>
              
                            <Spacer y={2} />
              
                            <div className="text-foreground-500">
                        Sau khi hoàn tất module này, bạn có thể viết Terraform configuration
                        để quản lý infrastructure một cách tự động và có tổ chức, sẵn sàng
                        triển khai trên các cloud provider.
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
                id: "devops-module-2",
                name: "AWS Core Infrastructure: VPC, IAM & EC2 with Terraform",
                description:
                    "Xây nền tảng AWS trước khi lên Kubernetes: thiết kế VPC (public/private), IAM policy cơ bản, và triển khai EC2 theo chuẩn production tối thiểu — tất cả đều bằng Terraform.",
                video: "",
                duration: "~3 hours",
                order: 2,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này giúp bạn nắm “xương sống” của AWS để dựng hạ tầng chuẩn bài:
                                mạng (VPC) + quyền (IAM) + compute (EC2). Bạn sẽ viết Terraform end-to-end
                                để tạo một bộ infrastructure AWS cơ bản, sẵn sàng nối sang CI/CD và EKS ở module sau.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Thiết kế VPC: public/private subnets, route tables, Internet Gateway (IGW), NAT Gateway</li>
                                <li>Network security: Security Group, NACL (đủ hiểu và áp dụng đúng use case)</li>
                                <li>IAM basics: users/roles/policies, least privilege, instance profile</li>
                                <li>EC2 fundamentals: AMI, instance types, key pair, User Data bootstrap</li>
                                <li>Operational access: SSM Session Manager (hạn chế SSH, chuẩn production)</li>
                                <li>Storage cho EC2: EBS cơ bản (size/type, attach, persistence)</li>
                                <li>EC2 scaling: Launch Template + Auto Scaling Group (mức cơ bản)</li>
                                <li>S3 basics: dùng cho Terraform remote state backend + artifact storage</li>
                                <li>CloudWatch cơ bản: logs/metrics để quan sát instance và debug khi có sự cố</li>
                                <li>Thực hành viết Terraform full stack: VPC + IAM + SG + EC2 (production-ready tối thiểu)</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Sau module này, bạn sẽ:</div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tự thiết kế được network AWS chuẩn: public/private subnets, routing, NAT/IGW</li>
                                <li>Biết set IAM role/policy đúng nguyên tắc least privilege cho EC2 workload</li>
                                <li>Triển khai EC2 theo chuẩn vận hành: bootstrap bằng user-data, truy cập qua SSM</li>
                                <li>Biết cách setup remote state backend trên S3 để làm việc team/prod an toàn</li>
                                <li>Có thể dựng “AWS core stack” bằng Terraform để làm nền cho EKS/CI-CD</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Cam kết:</div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể dựng được “hạ tầng AWS cơ bản” bằng Terraform
                                (VPC + IAM + Security Group + EC2), có remote state và monitoring cơ bản — đủ tiêu chuẩn
                                để triển khai ứng dụng thật và sẵn sàng bước sang Kubernetes (EKS) ở module tiếp theo.
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
                id: "devops-module-3",
                name: "AWS Kubernetes: EKS, Networking & Deployment with Terraform",
                description:
                    "Triển khai Kubernetes trên AWS với EKS theo chuẩn production: dựng cluster + node group, cấu hình networking, add-ons cơ bản và deploy ứng dụng — tất cả bằng Terraform.",
                video: "",
                duration: "~2 hours",
                order: 3,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này đưa bạn từ “AWS core stack” (VPC/IAM/EC2) lên Kubernetes thật sự với EKS.
                                Bạn sẽ dựng EKS bằng Terraform, hiểu cách EKS ăn vào VPC/subnet/security group,
                                cài các thành phần cần thiết để deploy app và vận hành cơ bản.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>EKS overview: control plane vs worker nodes, managed node group vs self-managed</li>
                                <li>Dựng EKS bằng Terraform: cluster, node groups, scaling cơ bản</li>
                                <li>Networking cho EKS: subnet tagging, security group pattern, endpoint access (public/private)</li>
                                <li>IAM cho Kubernetes: roles cho node group, giới thiệu IRSA (IAM Roles for Service Accounts)</li>
                                <li>Cluster access: kubeconfig, aws-auth config map (hiểu đúng quyền và cách truy cập)</li>
                                <li>Add-ons tối thiểu: metrics-server, CoreDNS, VPC CNI (hiểu vai trò & cấu hình cơ bản)</li>
                                <li>Ingress fundamentals: chọn hướng ALB Ingress Controller hoặc Nginx Ingress (tùy use case)</li>
                                <li>Deploy ứng dụng demo: Deployment, Service, Ingress, rolling update</li>
                                <li>Autoscaling: HPA cơ bản + hiểu metrics nguồn vào</li>
                                <li>Observability cơ bản: CloudWatch Container Insights (overview) / logs để debug</li>
                                <li>Tách Terraform modules: vpc / iam / eks / addons (structure chuẩn để scale team)</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Sau module này, bạn sẽ:</div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tự dựng được EKS cluster + node group bằng Terraform theo chuẩn production tối thiểu</li>
                                <li>Hiểu EKS networking (subnets, security groups, endpoint access) để tránh lỗi “mù mạng”</li>
                                <li>Deploy được ứng dụng lên EKS: service exposure, ingress, rolling update</li>
                                <li>Biết setup autoscaling cơ bản và nắm luồng vận hành/debug bằng logs/metrics</li>
                                <li>Có nền tảng sẵn sàng để nối CI/CD (ArgoCD/GitOps) và triển khai dự án thật</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>Cam kết:</div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể tự triển khai Kubernetes trên AWS (EKS) bằng Terraform,
                                cấu hình networking đúng chuẩn, cài add-ons cần thiết và deploy một ứng dụng end-to-end.
                                Đây là nền tảng để đi tiếp sang GitOps/CI-CD và vận hành production.
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
                id: "devops-module-4",
                name: "Kubernetes RBAC & AWS IAM Deep Dive",
                description:
                    "Hiểu và thiết kế hệ thống phân quyền chuẩn production cho Kubernetes trên AWS: RBAC trong cluster, IAM ngoài AWS và IRSA để kết nối bảo mật giữa hai thế giới.",
                video: "",
                duration: "~4.5 hours",
                order: 4,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này giúp bạn làm chủ security layer của hệ thống.
                                Sau khi đã deploy được EKS, bước tiếp theo là kiểm soát quyền truy cập đúng chuẩn:
                                ai được làm gì trong cluster, pod được phép truy cập tài nguyên AWS nào,
                                và làm sao để thiết kế least privilege thực sự.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li><strong>Kubernetes RBAC:</strong> Role vs ClusterRole</li>
                                <li>RoleBinding vs ClusterRoleBinding</li>
                                <li>Namespace isolation & thiết kế boundary giữa dev / staging / prod</li>
                                <li>ServiceAccount và cách Kubernetes gán identity cho workload</li>
                                <li>Principle of least privilege trong cluster</li>
                                <li>Multi-tenant cluster basics (cách tránh “dev chạm prod”)</li>
                                <li><strong>Thực hành:</strong> Dev chỉ được deploy trong namespace dev</li>
                                <li>Không được xem Secret namespace prod</li>
                                <li>CI chỉ được apply manifest, không được delete cluster resource</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                AWS IAM cho EKS:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>IAM Users vs IAM Roles (khi nào dùng cái nào)</li>
                                <li>aws-auth ConfigMap và cách map IAM ↔ Kubernetes RBAC</li>
                                <li>IAM Role cho node group (instance profile)</li>
                                <li>Thiết kế IAM Policy cơ bản (least privilege)</li>
                                <li>Phân tách quyền giữa admin, dev và CI trong AWS</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                IRSA (IAM Roles for Service Accounts) – phần quan trọng nhất:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Vì sao không nhét AWS credentials vào container?</li>
                                <li>Pod cần access S3 thì làm thế nào đúng chuẩn?</li>
                                <li>Map ServiceAccount ↔ IAM Role bằng OIDC provider</li>
                                <li>Thiết kế trust policy giữa EKS và AWS IAM</li>
                                <li>Security boundary giữa Kubernetes và AWS</li>
                                <li>Thực hành: tạo IAM Role cho workload truy cập S3 theo nguyên tắc least privilege</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Thiết kế được RBAC chuẩn production cho multi-namespace</li>
                                <li>Hiểu cách IAM và Kubernetes RBAC phối hợp trong EKS</li>
                                <li>Triển khai IRSA đúng chuẩn để workload truy cập tài nguyên AWS an toàn</li>
                                <li>Tránh các lỗi bảo mật phổ biến khi triển khai EKS</li>
                                <li>Nâng cấp tư duy từ “deploy được” lên “deploy an toàn & kiểm soát được”</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể thiết kế và triển khai hệ thống phân quyền
                                Kubernetes + AWS IAM đúng chuẩn production, áp dụng least privilege cho cả cluster
                                và workload. Đây là bước chuyển từ DevOps triển khai sang DevOps hiểu security thực sự.
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
                id: "devops-module-5",
                name: "CI Pipeline with Jenkins & Kaniko + GitOps Introduction (ArgoCD)",
                description:
                    "Xây dựng CI pipeline chuẩn production với Jenkins + Kaniko để build Docker image trong Kubernetes, và giới thiệu GitOps workflow với ArgoCD để deploy lên EKS.",
                video: "",
                duration: "~4.5 hours",
                order: 5,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này tập trung vào CI thực chiến: build, test, push image một cách an toàn
                                trong Kubernetes bằng Jenkins + Kaniko (không dùng Docker daemon).
                                Phần CD sẽ giới thiệu GitOps với ArgoCD, tận dụng Terraform đã setup từ trước.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>CI mindset: build → test → package → publish artifact</li>
                                <li>Triển khai Jenkins trên Kubernetes (hoặc EC2) và cấu trúc Jenkinsfile</li>
                                <li>Declarative pipeline: stages, agents, environment variables</li>
                                <li>Kaniko là gì? Vì sao không dùng Docker-in-Docker?</li>
                                <li>Build Docker image bằng Kaniko trong Kubernetes</li>
                                <li>Tagging strategy: commit SHA, version, latest</li>
                                <li>Push image lên Amazon ECR (auth bằng IAM role / IRSA)</li>
                                <li>Quản lý secrets trong Jenkins (credentials binding)</li>
                                <li>Security mindset: không hardcode credentials</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                GitOps Introduction với ArgoCD:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>GitOps concept: Git là single source of truth</li>
                                <li>ArgoCD architecture overview</li>
                                <li>Tạo Application và sync từ Git repository</li>
                                <li>Manual sync vs auto-sync</li>
                                <li>Rollback bằng cách revert Git commit</li>
                                <li>Kết nối pipeline: Jenkins update image tag → ArgoCD sync</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Tự xây dựng được CI pipeline với Jenkins + Kaniko</li>
                                <li>Build và push image an toàn lên ECR không cần Docker daemon</li>
                                <li>Hiểu GitOps workflow và vai trò của ArgoCD trong CD</li>
                                <li>Kết nối hoàn chỉnh flow: Code → Image → Git → ArgoCD → Kubernetes</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể tự động hóa quy trình build và publish image
                                theo chuẩn production bằng Jenkins + Kaniko, và triển khai ứng dụng lên EKS theo GitOps workflow.
                                Đây là bước hoàn thiện vòng đời DevOps từ code đến production.
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
                id: "devops-module-6",
                name: "AWS Production Services: KMS, Secrets, SQS, RDS & More",
                description:
                    "Mở rộng hệ thống trên AWS với các services hay gặp trong production: mã hóa (KMS), quản lý secrets, messaging queue, database managed và các mảnh ghép vận hành thực tế khi chạy trên EKS.",
                video: "",
                duration: "~4.5 hours",
                order: 6,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này giúp bạn “ghép các mảnh production” trên AWS thay vì chỉ có compute + Kubernetes.
                                Bạn sẽ hiểu khi nào dùng từng service, cách tích hợp với EKS, và các best practices tối thiểu
                                để hệ thống an toàn, dễ vận hành và scale được.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li><strong>KMS (Key Management Service):</strong> encryption at rest, customer-managed keys (CMK), key policy cơ bản</li>
                                <li><strong>Secrets Manager / SSM Parameter Store:</strong> lưu secrets đúng chuẩn, rotation (overview), phân quyền truy cập</li>
                                <li><strong>S3 nâng cao:</strong> bucket policy, encryption, versioning, lifecycle, presigned URL</li>
                                <li><strong>SQS / SNS:</strong> queue vs pub/sub, retry & DLQ, khi nào nên tách async processing</li>
                                <li><strong>RDS / Aurora (overview):</strong> managed database, backups, multi-AZ, connection strategy</li>
                                <li><strong>ElastiCache Redis (overview):</strong> caching vs session vs rate-limit, persistence & failover concept</li>
                                <li><strong>CloudWatch nâng cao:</strong> log groups, metrics, alarms, basic dashboarding</li>
                                <li><strong>ALB/NLB basics:</strong> load balancer types, when to use, mapping với Ingress/EKS</li>
                                <li><strong>Security baseline:</strong> IAM least privilege, security groups pattern, audit mindset</li>
                                <li><strong>Integration patterns:</strong> EKS workload dùng IRSA để access S3/SQS/Secrets an toàn</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu “bộ services AWS” phổ biến cho production và cách chọn đúng theo use case</li>
                                <li>Biết dùng KMS/Secrets Manager để bảo vệ secrets & dữ liệu đúng chuẩn</li>
                                <li>Thiết kế được luồng async bằng SQS/SNS (retry, DLQ) để hệ thống ổn định hơn</li>
                                <li>Biết cách tích hợp EKS với AWS services bằng IRSA theo least privilege</li>
                                <li>Nâng tư duy từ “deploy chạy được” sang “deploy có security & vận hành được”</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể lựa chọn và tích hợp các AWS services quan trọng
                                (KMS, Secrets, SQS, RDS, S3, CloudWatch...) để xây dựng hệ thống production-ready,
                                an toàn và dễ mở rộng khi chạy trên Kubernetes (EKS).
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
                id: "devops-module-7",
                name: "GCP Quick Overview: Core Services & Architecture",
                description:
                    "Giới thiệu nhanh hệ sinh thái GCP và các services quan trọng để bạn hiểu cách GCP map với AWS và dùng khi nào hợp lý.",
                video: "",
                duration: "~2 hours",
                order: 7,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này giúp bạn nắm GCP ở mức “đủ dùng để đi làm”: hiểu các dịch vụ cốt lõi,
                                cách tổ chức project/account, và đối chiếu nhanh với AWS để không bị bỡ ngỡ khi gặp hệ thống multi-cloud.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>GCP basics: Project, Billing, IAM, Service Accounts (overview)</li>
                                <li>Networking: VPC, subnets, firewall rules, Cloud NAT (map tương đương AWS)</li>
                                <li>Compute: Compute Engine, Instance templates, Managed Instance Groups (overview)</li>
                                <li>Storage: Cloud Storage buckets, IAM/policies, lifecycle (overview)</li>
                                <li>Database: Cloud SQL (overview) + khi nào dùng managed DB</li>
                                <li>Observability: Cloud Logging, Cloud Monitoring (overview)</li>
                                <li>So sánh nhanh AWS ↔ GCP: naming, mental model, dịch vụ tương đương</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu cách GCP tổ chức account/project và permission ở mức cơ bản</li>
                                <li>Nắm các dịch vụ GCP hay gặp và map được sang AWS tương đương</li>
                                <li>Không bị “ngợp” khi chuyển môi trường hoặc đọc infra trên GCP</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau module này, bạn có thể đọc hiểu hệ thống cơ bản trên GCP và đối chiếu nhanh với AWS,
                                đủ nền tảng để làm việc với các dự án multi-cloud hoặc migrate đơn giản.
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
                id: "devops-module-8",
                name: "GKE Quick Start: Kubernetes on GCP (Compare with EKS)",
                description:
                    "Giới thiệu nhanh Kubernetes trên GCP với GKE: cách tạo cluster, networking cơ bản và cách GKE khác EKS để bạn nắm được “điểm rơi” khi làm thực tế.",
                video: "",
                duration: "~2 hours",
                order: 8,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này là “tour nhanh” về GKE để bạn hiểu Kubernetes managed trên GCP vận hành thế nào,
                                và so sánh trực tiếp với EKS: IAM/RBAC, networking, ingress/load balancer, và cách debug cơ bản.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>GKE overview: control plane, node pools, autopilot vs standard (overview)</li>
                                <li>Tạo cluster nhanh, cấu hình node pool và autoscaling cơ bản</li>
                                <li>Networking: VPC-native cluster, services exposure, firewall/LB concept</li>
                                <li>Ingress trên GKE (overview): load balancer integration</li>
                                <li>Identity & access (overview): IAM, service accounts, workload identity (so sánh với IRSA)</li>
                                <li>Observability: Cloud Logging/Monitoring cho GKE (overview)</li>
                                <li>So sánh thực chiến: EKS vs GKE (khi nào chọn cái nào)</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Hiểu cách GKE hoạt động và những khác biệt chính so với EKS</li>
                                <li>Nắm được các khái niệm cần thiết để deploy/operate Kubernetes trên GCP</li>
                                <li>Biết cách map workload identity trên GCP với IRSA trên AWS ở mức concept</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể đọc hiểu và triển khai Kubernetes cơ bản trên GKE,
                                đồng thời so sánh được EKS vs GKE để chọn nền tảng phù hợp cho từng bài toán.
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
                id: "devops-module-9",
                name: "DigitalOcean Quick Overview: Deploy & Operate for Small Teams",
                description:
                    "Giới thiệu nhanh DigitalOcean: lựa chọn tối ưu cho team nhỏ/startup cần triển khai nhanh với chi phí dễ kiểm soát.",
                video: "",
                duration: "~1.5 hours",
                order: 9,
                content: (
                    <div className="text-sm flex flex-col gap-4 ml-4">
                        <div>
                            <div>
                                Module này giúp bạn hiểu DigitalOcean theo hướng thực dụng: khi nào DO phù hợp,
                                các dịch vụ quan trọng (Droplet, DOKS, Managed DB, Spaces) và cách triển khai nhanh một hệ thống nhỏ.
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>DigitalOcean overview: pricing mindset, use case phù hợp (startup/SMB)</li>
                                <li>Compute: Droplets, snapshots, basic firewall (overview)</li>
                                <li>Kubernetes: DOKS overview, node pools, load balancer integration</li>
                                <li>Managed DB: PostgreSQL/Redis basics (overview) + backup concept</li>
                                <li>Storage: Spaces (S3-compatible), CDN concept</li>
                                <li>Networking basics: VPC, floating IP, load balancers (overview)</li>
                                <li>So sánh nhanh: DO vs AWS (đơn giản hóa vs độ linh hoạt)</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Sau module này, bạn sẽ:
                            </div>
            
                            <Spacer y={2} />
            
                            <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                                <li>Biết khi nào nên chọn DigitalOcean thay vì AWS/GCP</li>
                                <li>Hiểu các dịch vụ DO thường dùng để deploy nhanh hệ thống nhỏ</li>
                                <li>Đủ nền tảng để đọc hiểu infra và vận hành cơ bản trên DO</li>
                            </ul>
                        </div>
            
                        <div>
                            <div>
                                Cam kết:
                            </div>
            
                            <Spacer y={2} />
            
                            <div className="text-foreground-500">
                                Sau khi hoàn tất module này, bạn có thể triển khai và vận hành cơ bản trên DigitalOcean,
                                hiểu rõ trade-off về chi phí, độ đơn giản và khả năng mở rộng khi so với AWS/GCP.
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
    }
]
