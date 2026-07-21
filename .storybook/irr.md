# irr.md — Block "sai nguyên tắc" (irregularities)

> Các component ban đầu nằm ở feature dirs (commerce/feed/grading/learn/marketing/notifications/async + feature cards)
> được xét theo nguyên tắc Block. Block = **composite ghép từ `Primitives/*`**. Những cái dưới đây vi phạm — đánh dấu để
> khi **sync ngược sang `src/`** thì refactor. Nguyên tắc: **P1** compose primitive · **P2** không duplicate primitive ·
> **P3** composite tái dùng thật (không pure-logic/scene/fixture) · **P4** render isolation (props-only) · **P5** không phải primitive trá hình.
> (Storybook-driven rebuild — xem `PORTING_SPEC.md` / `BLOCK_SPEC.md`.)

## A. Thật ra là PRIMITIVE, không phải Block (P5 / P1 — atom không compose gì)
Nên chuyển xuống tier `Primitives/*`.

| Component | Vi phạm | Vì sao |
|---|---|---|
| `commerce/PhaseScarcityNote` | P5 · P3 | 1 dòng cảnh báo (WarningCircleIcon + text), compose 0 primitive. |
| `grading/DiffViewer` | P1 · P5 | tự vẽ mọi gutter/row/cell trên Typography trần; leaf renderer. |
| `grading/GradeCreditCaption` | P5 · P1 | atom 1 dòng (span/button + 1 icon), compose 0 primitive. |
| `grading/SelfHostGpuMark` | P5 | icon + tooltip atom; GradeModelDropdown còn *dùng nó NHƯ* primitive. |
| `grading/GradingByline` (phần `VerdictIcon`) | P5 partial | `ModelByline` là composite OK (compose AiCategoryChip), nhưng file bundle kèm `VerdictIcon` = atom glyph → tách ra Primitive. |
| `feed/EntityLink` | P5 | 1 `Link`/`span` styled, compose 0 block. |
| `feed/ChatBubble` | P5 · ~P1 | 1 `div` tint + canh lề; atom mà ChatPanel dựng lên. |
| `marketing/ArchitectureFlow` | P1 · P5 | tự vẽ node box + caret, compose 0 primitive. |
| `learn/EntityResultRow` | ~P5 · P2 | gần atom (1 row); đã sửa để compose EnumChip (xem mục C). |

## B. Là LAYOUT wrapper, không phải Block (P3)
Nên về tier Layout, không phải Block.

| Component | Vi phạm | Vì sao |
|---|---|---|
| `feed/Timeline` | P3 · P5 | chỉ vẽ đường nối trái quanh `children`; compose 0 (caller nhét FeedItem). |
| `feed/FeedItem` | P1 borderline | row-layout generic (leading + text col + footer) trên Typography trần; slot-based → lean layout primitive. |

## C. DUPLICATE primitive — nên COMPOSE thay vì vẽ tay (P2)
Port đã sửa để compose (hoặc khuyến nghị sửa) — khi sync `src` phải đổi theo.

| Component | Duplicate | Ghi chú |
|---|---|---|
| `async/EmptyContent` | EmptyState | src tự vẽ icon+Typography+Button → port đã compose EmptyState. Khuyến nghị `src` compose/replace. |
| `async/ErrorContent` | ErrorState | y hệt (WarningOctagon vs ErrorState WarningIcon). Port compose ErrorState (bản feedback local ĐÃ có → reconcile). |
| `notifications/NotificationItem` | IconTile | inline tile 40px (IconTile nhỏ nhất 48px) → nên cho IconTile thêm size-10 rồi compose. |
| `cards/ContinueCard` | Button | nhánh `hero+href` vẽ tay accent-Link thay vì Button (nhánh onPress đã dùng Button). |
| `marketing/TrackCard` | IconTile | tự vẽ leading icon tile thay vì compose IconTile. |
| `marketing/TopicLane` | ListRow | tự vẽ clickable row thay vì compose ListRow. |
| `marketing/MicroservicesDiagram` | StatusChip | inline soft-danger Chip thay vì StatusChip (xem thêm mục E). |
| `learn/EntityResultRow` | EnumChip | src hand-roll soft chip → port đã sửa compose EnumChip. |

## D. PURE-LOGIC / non-visual — KHÔNG phải Block (P3) → KHÔNG port
Đã bỏ, không dựng story giả.

| Component | Vi phạm | Vì sao |
|---|---|---|
| `async/AsyncContent` | P3 | switcher priority error→loading→empty→content; 0 UI riêng, chỉ delegate. |
| `async/InfiniteScrollSentinel` | P3 · P4 | IntersectionObserver render `div aria-hidden h-px`; 0 UI + cần scroll/observer sống. |

## E. LANDING-only SCENE / FIXTURE — không phải composite tái dùng (P3)
Render được isolation nhưng gần như 0 prop / art cứng → thuộc trang landing, không phải block tái dùng.

| Component | Vi phạm | Vì sao |
|---|---|---|
| `marketing/SitePreview` | P3 | minh hoạ cố định, ZERO prop (nav/filter/course list hardcode). |
| `marketing/MicroservicesScene` | P3 | SVG art cứng, chỉ prop `caption`. |
| `marketing/MicroservicesDiagram` | P1·P2·P3 | monolith node hardcode + inline Chip; chỉ `caption` là prop. |
| `marketing/ArchitectureScene` | P1 + dep nặng | WebGL scene (three/R3F/drei); data-driven nhưng compose 0 primitive — feature-scene. |

## F. KHÔNG render isolation — coupling data-fetch/socket/router (P4)
Cần tách container/presentational khi refactor `src`.

| Component | Vi phạm | Vì sao |
|---|---|---|
| `learn/RelatedContentList` | P4 | tự bắn RAG query (SWR) + router/locale bên trong; port phải refactor nhận `results`/`isLoading`. |
| `grading/GradeModelDropdown` | P4 | phụ thuộc socket `/system_health` (`useAiModelLatency`); port stub Map rỗng. |
| `cards/CourseCard` | P4 | `"use client"` đọc useRouter/useTranslations/useLocale/publicEnv; port stub để render. |

## G. Borderline (giữ là Block, ghi chú)
- `commerce/PriceTag` — P1 mỏng: chỉ compose StatusChip, phần giá là Typography+Popover raw. Vẫn là composite hợp lệ.
- `feed/ReactionBar` — P1/P5: leaf tương tác tự chứa (picker 6-emoji trên button + framer-motion); tái dùng thật nhưng compose 0 primitive.
- `SectionHeading` / `HeroBanner` / `ShowcaseMockup` / `TruthList` — hợp lệ; eyebrow/keyword dùng raw HeroUI `Chip` là ĐÚNG (soft eyebrow ≠ StatusChip/EnumChip), không tính vi phạm.
