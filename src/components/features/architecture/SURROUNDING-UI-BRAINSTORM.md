# UX Brainstorm — /architecture: conformance quanh map + GitHub source link (2026-07-04)

> `/starci-fe-ux-brainstorm` · MAX effort (Opus, song song) · KHÔNG code. Map 3D + pod/drill-down/snap-grid ĐÃ
> xong (xem `ATLAS-GRID-CORE-BRAINSTORM.md`). Lượt này CHỈ soi phần XUNG QUANH map (rail/panel/curl/toggle) đối
> chiếu `.claude/rules/elements/{list,card,button,sidebar}.md` + thêm link GitHub backend.

## 0. Audit hiện trạng (grounded, đọc code thật)

| Khối | Hiện tại | Đối chiếu rule | Verdict |
|---|---|---|---|
| **ArchitectureRail** | HeroUI `ListBox` + `Label`, item `rounded-2xl px-3 py-2`, hover `data-[hovered]:bg-default-100`, selected `data-[selected]:bg-accent/10`, `ScrollShadow` | **elements/list.md §4** (ListBox flat rail, y hệt class) | ✅ ĐÚNG CHUẨN sẵn |
| **ArchitectureMobileNav** | chip `rounded-full border`, selected `border-accent bg-accent/10 text-accent` | [[master-detail-rail-as-filter-and-mobile-chips]] (mobile fold chip-row) | ✅ ĐÚNG CHUẨN sẵn |
| **NodeDissectionPanel** | HeroUI `Card`+`CardContent` trần (không LabeledCard) | elements/card.md §4 — detail pane của master-detail = surface Card trần, KHÔNG cần LabeledCard (nó tự có identity riêng, giống [[submission-result-flat-listbox-rail-and-detail-surface-card]]) | ✅ ĐÚNG PATTERN — chỉ 1 lỗi nhỏ: divider "Vì sao quan trọng" dùng `border-t pt-4` | ⚠️ `pt-4`→`pt-3` (rule divider-gap-3, 2026-06-30) |
| **CurlTester** | bọc `<LabeledCard label="...">`, code block `bg-default p-3 font-mono`, nút Copy=`tertiary`, Run=`secondary` | elements/card.md §2 (LabeledCard đúng) ✅ · elements/button.md §1 (secondary phải cặp với primary) | ⚠️ Run+Copy không có primary nào cạnh → cả 2 lẽ ra `tertiary`, HOẶC nâng Run lên `primary` (nó LÀ CTA của card này — "tự kiểm tra") |
| **2 toggle SegmentedControl** | `justify-between`, era trái/layout phải, `gap-3` | gap.md (0/2/3/6/8) | ✅ ĐÚNG |
| **Link GitHub backend** | **CHƯA TỒN TẠI** — không hardcode URL nào trong FE; pattern gần nhất = blog's `sourceUrl` field (button `viewSource`, nhưng đó là field GENERIC cho từng bài, không phải 1 link cố định cho toàn trang) | — | ❌ CẦN THÊM MỚI |

**Tóm lại: rail + mobile-nav + toggle đã chuẩn 100% — không đụng.** Chỉ cần: (a) sửa 1 spacing nhỏ ở panel, (b) quyết định lại vai Run/Copy, (c) **thêm link GitHub** (việc chính của lượt này).

## 1. Nghiên cứu đặt link GitHub (ref ngoài — không bịa)
Soi 4 pattern thật (Supabase, PostHog, Upptime, Cachet):
- **Navbar badge + star-count** (Supabase/PostHog) — mạnh, nhưng cần **số sao đáng kể**; StarCi repo mới, số sao thấp → phản tác dụng (đếm ít trông yếu). **Loại.**
- **Nav/footer text link, không đếm sao** (Upptime — chính status-page open-source) — khiêm tốn, đúng tinh thần "đây là repo thật, tự xem".
- **Footer "powered by" attribution** (Cachet) — quá thấp cho trang atlas (đây là trang HERO build-in-public, không phải widget nhúng).
- **Per-component/inline** (Backstage-style) — mỗi node tự có link riêng — HAY nhưng dữ liệu (`sourceUrl` per-component) chưa có ở BE `systemHealthStatus`, phải bịa/omit tuỳ node → không grounded 100%.

**Khuyến nghị (khớp research + rule button):** **page-header secondary button "Xem mã nguồn ↗"** cạnh tiêu đề — đúng vị trí "đóng khung cả trang là build-in-public", **secondary/tertiary weight, KHÔNG primary** (map+dot mới là hero; link nguồn là "đừng tin, tự xem" — proof chứ không phải CTA). Khớp [[engineering-blog-reframe-and-public-infra-showcase-no-prod-leak]] (build-in-public framing) + elements/button.md §1 (secondary/tertiary cho hành động phụ).

## 2. 2 hướng đặt (mockup dưới) → CHỐT A
- **A ✅ — PageHeader `actions` slot** (button "Xem mã nguồn ↗" bên phải title, cùng hàng breadcrumb/title). 1 chỗ duy nhất, không lặp, đúng vị trí "khung nguồn cho cả trang".
- **B — Per-node trong NodeDissectionPanel** (thêm 1 link "Xem code module này" cạnh "Đọc bài mổ xẻ"). Hay nhưng cần field mapping module→path thật trong repo (module_name → `src/modules/xxx`) — **defer**, KHÔNG grounded đủ ngay (chưa có field/convention path chuẩn per-node). Có thể làm SAU khi có field đó.

**Chốt: A ngay** (không cần data mới, dùng ĐÚNG 1 URL repo backend cố định). B để dành optional sau.

## 3. Việc cần code (khi thầy chốt URL thật)
1. `Architecture/index.tsx` — `PageHeader actions={<Link href={BACKEND_REPO_URL} target="_blank"><Button variant="tertiary" size="sm">Xem mã nguồn <ArrowUpRightIcon/></Button></Link>}`.
2. `NodeDissectionPanel`: `border-t border-default pt-4` → `pt-3` (divider-gap-3 rule).
3. `CurlTester`: đổi `Run` → `variant="primary"` (CTA thật của card này), `Copy` giữ `tertiary` (đứng lẻ, không secondary vì secondary cần cặp primary — giờ có primary Run rồi thì Copy vẫn tertiary vì nó không phải "lựa chọn thứ 2 của cùng quyết định", nó là action phụ khác việc).
3b. i18n `architecture.header.viewSource` (vi "Xem mã nguồn" / en "View source").

## Cần thầy chốt
- **URL repo backend công khai** (thấy tab trình duyệt thầy có mở `starci-lab/star...` — trò KHÔNG đoán, cần thầy xác nhận URL đúng, vd `https://github.com/starci-lab/starci-academy-backend`).
- Xác nhận **B (per-node link) để sau**, không làm ngay.

## Refs
- Supabase 100k stars, PostHog, Upptime, Cachet (đã dẫn link trong nghiên cứu agent) — placement/weight cho "view source".
- Nội bộ: `elements/{list,card,button}.md` · [[master-detail-rail-as-filter-and-mobile-chips]] · [[submission-result-flat-listbox-rail-and-detail-surface-card]] · draft divider-gap-3 (2026-06-30, đã có trong `layouts/gap.md`).
