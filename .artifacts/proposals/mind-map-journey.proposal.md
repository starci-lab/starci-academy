# Proposal — mind-map-journey (vẽ lại mind-map thành HÀNH TRÌNH serpentine, dual-tab)

> Thầy chốt "xúc": thay `MindMap` (React-Flow cây liệt kê, nhàm) bằng **hành trình leo tới mastery** — serpentine auto-layout + scroll + progressive detail, **2 lộ trình song song tab qua lại** (📚 Học ⇄ 🏗️ Dự án Capstone).
>
> **Prototype chốt:** `.artifacts/prototypes/mind-map-dual/index.html` (host :8098). Tham chiếu thêm: `mind-map-scale` (chứng minh 20-module scale), `mind-map-vibes` (3 vibe, adventure thắng).

## JOB → SHELL
- **JOB:** học viên ĐỊNH HƯỚNG lộ trình — "đang ở đâu · học/làm gì tiếp · còn bao xa tới mastery" + tạo ĐỘNG LỰC (wow, gamified). KHÔNG phải work-surface.
- **SHELL:** full-bleed canvas (giữ). Trong đó = **pill-tabs primary** (Học/Dự án) trên 1 **scroll-viewport serpentine**.

## Data ceiling — 100% render-là-xong (0 BE)
Nguồn DUY NHẤT: `useQueryMyCourseOutlineSwr(courseId)` (đã fetch sẵn ở `MindMap/Canvas`). Trả:
- `modules[] → lessons[] (isRead) → challenges[] (status/lastScore/completed)` → nuôi **tab Học**.
- `milestones[] → tasks[] (completed/lastScore/type)` → nuôi **tab Dự án**.
- `progress` (lessonsRead/Total, challengesCompleted/Total, tasksCompleted/Total, completionPercent) → HUD.
- `currentTask` (capstone-first) + `nextContentTask` (content-first) → avatar "Bạn ở đây" + CTA "Tiếp tục".
→ KHÔNG cần BE mới. (Nice-to-have sau: 1 field `milestone.orderIndex`/progress-per-chặng nếu muốn gọn — không bắt buộc.)

## Kiến trúc (rebuild, bỏ @xyflow/react)
| File | Vai |
|---|---|
| `MindMap/index.tsx` (sửa) | container: `AsyncContent` (loading/empty→phễu học) + fetch `myCourseOutline` → `<JourneyMap>` |
| `MindMap/JourneyMap/index.tsx` (mới) | shell: pill-tabs Học/Dự án (state) + `<SerpentineTrack>` theo tab; đổi tông màu/nền theo tab |
| `MindMap/JourneyMap/SerpentineTrack/index.tsx` (mới) | scroll-viewport + track cao + SVG path (completed glow / ahead dim) + nodes; auto-center current; nút "↧ Vị trí của tôi"; HUD; avatar; summit |
| `MindMap/JourneyMap/journey.ts` (mới) | **build normalized `Journey` từ myCourseOutline**: waypoints[] (module/milestone) + children (lesson/challenge/task) + status + currentIndex + summit + serpentine `x=W/2+A·sin(i·k)`, `y` theo scroll |
| `MindMap/JourneyMap/WaypointNode`, `SatelliteBloom`, `SummitNode`, `AvatarMarker` (mới) | node presentational (orb + progress badge + status; current "nở" lesson-dot + challenge-diamond) |
| Xóa/nghỉ | `Canvas`, `build.ts`, `progress.ts`, `RootNode`, `ModuleNode`, `ModuleSlotNode`, `MindMapCanvas` (React-Flow) — confirm 0 importer khác trước khi xóa; `@xyflow/react` gỡ nếu không nơi khác dùng (StandaloneMindMap guest — CHECK) |

## 3 cơ chế SCALE (20+ module OK)
1. **Auto-layout serpentine** (JS sin-wave) — N bất kỳ.
2. **Scroll** — track cao `topPad + N·dy + botPad`; auto-center current on mount; jump button.
3. **Progressive detail** — overview mỗi waypoint = 1 orb + badge tổng (`2/4 · ⚔️1/3`); CHỈ current "nở" children. Không nhồi.

## State-matrix + conversion
- **Loading** → skeleton serpentine (mirror). **Empty** (chưa enroll/chưa có module) → EmptyContent + CTA "Vào học" (phễu). 
- **1 primary/màn** = CTA "Tiếp tục học" (→ `currentTask`/`nextContentTask`). Mọi node click → nhảy surface đúng (lesson reader / challenge / milestone-task) qua `pathConfig` — KHÔNG ngõ cụt. HONEST: mọi số từ progress thật.
- Tab Học vs Dự án: 2 `currentTask` khác (content vs capstone) → mỗi tab avatar/CTA riêng.

## Block canonical
Node/serpentine = **bespoke** (không có block canvas trong `.claude/fe`; đây là surface đặc thù — như MindMap cũ tự chế). Dùng lại: `IconTile`? không (orb tròn riêng), `AsyncContent`, `Button` (CTA), pill-tabs theo `tabs.md` primary, `UserAvatar` (avatar marker), Phosphor icons. Node bespoke OK (MindMap vốn là feature canvas riêng, tiền lệ React-Flow node cũng bespoke).

## Verify plan
- `tsc --noEmit` (lọc PriceTag) + eslint mọi file mới.
- Runtime: thầy soi `/vi/courses/<slug>/learn/mind-map` — tab qua lại, scroll, current center, click node → nhảy đúng, CTA resume.
- grep: `@xyflow/react` còn importer nào không (StandaloneMindMap/guest) trước khi gỡ dep.

## Story
Feature-comp (canvas) → không story (MindMap cũ cũng không). 

## Rủi ro / ghi chú
- Rebuild lớn, nhiều file mới + xóa React-Flow. Giữ `MindMap/index.tsx` route mount ổn định.
- `StandaloneMindMap` (guest/public variant) dùng React-Flow — CHECK: nếu public mind-map còn xài, giữ nó hoặc port riêng (có thể để phase sau, không xóa vội).
- Auto-layout + scroll + navigation = phần dễ sai runtime → verify kỹ.
