import { Course } from "@/types"

export const data: Array<Course> = [
    {
        id: "fullstack",
        name: "Khóa Fullstack",
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
                name: "Backend Environment & NestJS Foundations",
                description: "Thiết lập môi trường phát triển Node.js, hiểu kiến trúc cơ bản của NestJS và khởi tạo dự án backend đầu tiên.",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 1,
            },
            {
                id: "module-2",
                name: "Database Integration, ORM/ODM & Caching",
                description: "Tích hợp cơ sở dữ liệu SQL và NoSQL trong NestJS, sử dụng TypeORM cho hệ quản trị quan hệ và Mongoose cho MongoDB; triển khai caching với Redis để tối ưu hiệu năng và giảm tải hệ thống.",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 2,
            },
            {
                id: "module-3",
                name: "REST API Development & API Documentation (Swagger/Scalar)",
                description:
                  "Xây dựng REST API cơ bản trong NestJS theo chuẩn CRUD; thiết kế DTO + validation, chuẩn hoá response và error handling; viết tài liệu API và cấu hình Swagger/Scalar để testing và chia sẻ endpoint rõ ràng cho team.",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 3,
            },
            {
                id: "module-4",
                name: "Authentication & Authorization",
                description: "Xây dựng hệ thống xác thực và phân quyền trong NestJS với Passport và JWT; triển khai đăng nhập/đăng ký, access & refresh token, guards, role-based access control (RBAC), và tích hợp OAuth2 (Google) để hỗ trợ social login và bảo mật API",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 3,
            },
            {
                id: "module-5",
                name: "Authentication & Authorization",
                description: "Xây dựng hệ thống xác thực và phân quyền trong NestJS với Passport và JWT; triển khai đăng nhập/đăng ký, access & refresh token, guards, role-based access control (RBAC), và tích hợp OAuth2 (Google) để hỗ trợ social login và bảo mật API",
                video: "https://via.placeholder.com/150",
                duration: "1 hour",
                order: 3,
            }
        ]
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
