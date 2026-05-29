# 03 — Layout Archetypes

Ba khung trang chuẩn. Build page mới → chọn archetype gần nhất, tái dùng grid + component của nó.

## A. Course detail (`layouts/Course/index.tsx`)
Container `max-w-[1280px]`, `grid md:grid-cols-5`.
```
┌─ breadcrumbs ───────────────────────────────────┐
│ left (col-span-3)            │ right (col-span-2) │
│  title (text-4xl bold)       │ ┌ EnrollCard ────┐ │
│  description (foreground-500)│ │ cover image    │ │
│  Alert "Yêu cầu đầu vào"     │ │ Stepper pricing│ │
│  Accordion curriculum         │ │ (Pioneer/Early │ │
│   (row + count-chip 12/8/3)   │ │  Bird/Regular  │ │
│  QnA                          │ │  + Save% chip) │ │
│                               │ │ ValueProps ✓   │ │
└───────────────────────────────┴────────────────────┘
```
- Right rail `EnrollCard`: cover img + `Stepper` pricing + checklist `SealCheckIcon`. Là nơi mở `PaymentModal` (flow course-enroll).
- Responsive: `md:` mới chia cột; mobile xếp dọc (right rail xuống dưới).

## B. Course learn (`app/[locale]/courses/.../learn/layout.tsx`, `grid grid-cols-4`)
```
┌ icon Sidebar ┬ center (Module) ────────────┬ right rail ─┐
│ Sơ đồ tư duy │ breadcrumbs                  │ ModuleSidebar│
│ Học phần ◄   │ title + description          │ outline:     │
│ Nền tảng     │ "Giới thiệu" objectives      │ ⏱ 15 phút đọc │
│ Headhunting  │  (mỗi dòng prefix `{}`)      │ ▦ 0 bài giảng│
│ CV           │ "Nội dung" content card grid │ ⚔ 3 thử thách│
│ Dự án cá nhân│                              │             │
│ Bảng xếp hạng│                              │             │
│ StarCi AI    │                              │             │
└──────────────┴──────────────────────────────┴─────────────┘
```
- Sidebar: `ListBox`+`ScrollShadow`, row active `text-accent bg-accent/10`.
- Sub-layout module thêm right rail `ModuleSidebar` (`grid lg:grid-cols-3`) với meta-chip mỗi item.
- Objectives: list, mỗi dòng `BracketsCurlyIcon` + text. View này thường hiển thị **dark**.

## C. Challenge detail (`modals/ChallengeModal`, `Modal size="full"`)
```
┌ title (center) + ⓣ "20 điểm" chip(accent) + ⚔ "Dễ" chip(difficulty) ─ ✕ ┐
│ left (2/5)                      │ right (3/5)                            │
│  Các bước thực hiện             │  Bước 1..N (hướng dẫn)                 │
│  Điều kiện tiên quyết           │   + code block (copy)                  │
│  Yêu cầu (accordion)            │  Yêu cầu tối thiểu / Nice to have      │
└─────────────────────────────────┴────────────────────────────────────────┘
```
- `lg:grid-cols-5`: trái col-span-2 (tasks/requirements/outputs), phải col-span-3 (steps + code).
- Score chip accent (trophy), difficulty chip theo palette ([01](01-tokens.md)).

## Ghi chú chung
- Mọi archetype: breadcrumbs trên cùng, title bold + description `foreground-500`, nội dung gom vào Card/Accordion bo góc.
- Grid chỉ chia ở breakpoint (`md:`/`lg:`); mobile xếp dọc.
