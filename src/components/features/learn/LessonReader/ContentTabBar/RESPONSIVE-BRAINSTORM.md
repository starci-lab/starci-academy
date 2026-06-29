# ContentTabBar — responsive brainstorm (dual tab bar) — 2026-06-27

## Vấn đề
`TabsCard` render 2 nhóm tab trên **1 hàng** (`flex justify-between gap-3`): trái = `leftTabs` (Nội dung / Thử thách, có icon), phải = `rightTabs` (bộ chọn ngôn ngữ TS/Java/C#/Go, brand logo). Responsive hiện tại: tab CÓ icon → mobile icon-only (`sr-only sm:not-sr-only`). Khi màn HẸP (mobile / cửa sổ bị bóp): 2 content-icon + 4 language-icon chen 1 hàng → **chật**, và content tab **mất nhãn** (book/puzzle mơ hồ).

## Phân vai (quyết định IA)
- `leftTabs` (Nội dung/Thử thách) = **PRIMARY nav** — đổi cả body. Phải rõ + 1 chạm + GIỮ NHÃN.
- `rightTabs` (ngôn ngữ) = **preference đặt-1-lần** (chọn lang code muốn xem). Ít đổi → có thể thu gọn khi chật.

## 3 hướng (xem widget mockup)
| | Hướng | Mobile | Trade-off |
|---|---|---|---|
| A | Xếp 2 hàng | content tabs hàng 1 (có nhãn) · language tabs hàng 2 (`border-t`) | rõ, giữ nhãn cả 2 · +1 hàng chiều cao |
| **B ⭐** | **Ngôn ngữ → dropdown** | content tabs 1 hàng (giữ nhãn) · language thu thành 1 `Select` (lang hiện tại + caret) pinned phải; `sm+` bung lại thành inline tabs | gọn, tab chính rõ · đổi lang = 2 chạm |
| C | 1 hàng icon-only + cuộn | cả 2 nhóm icon-only, `overflow-x-auto` | gọn nhất · content tab mất nhãn + cuộn toolbar khó chịu |

## CHỐT: Hướng B
**Lý do:** đúng phân vai — PRIMARY nav (content tabs) giữ nguyên rõ ràng + 1 chạm; SECONDARY preference (ngôn ngữ, đặt-1-lần) thu thành dropdown khi chật. Là convention chuẩn của docs/code-reader (**Stripe API docs · Mintlify · Docusaurus** đều để language/version selector thành dropdown trên mobile, giữ nav chính). Không tốn thêm hàng (khác A), không mất nhãn nav (khác C).

**Ref:** Stripe API docs (language column → mobile dropdown) · Mintlify · Docusaurus i18n/version dropdown. Codebase: [[tabscard-two-secondary-groups]] · [[master-detail-rail-as-filter-and-mobile-chips]] (mobile collapse) · [[when-drawer]] (giấu phụ sau 1 trigger) · [[single-select-among-options-use-tabs]] (desktop = tabs; mobile space-constrained = dropdown).

## Cách dựng (cho `/starci-fe-ux-apply`) — đổi ở BLOCK `TabsCard`, feature giữ nguyên data
1. `leftTabs` (content tabs): **bỏ icon-only-on-mobile** cho nhóm này — giữ nhãn (chỉ 2 item, là nav chính). Có thể giữ `gap-2` icon+label.
2. `rightTabs` responsive switch **trong block** (đọc cùng 1 group data):
   - `sm+`: render inline `ExtendedTabs` như hiện tại (`hidden sm:flex`).
   - mobile: render **1 `Select`/`Dropdown`** (HeroUI) — trigger = item đang chọn (logo + nhãn) + caret; options = `group.items`; `onSelectionChange` y nguyên (`flex sm:hidden`).
3. Thêm prop cho TabsCard biết nhóm nào "thu được" (vd `rightTabs` mặc định collapse mobile), hoặc 1 cờ `collapseRightOnMobile`. Style ở block; ContentTabBar không đổi.
4. a11y: Select có `aria-label` = `rightTabs.ariaLabel`; giữ `sr-only` label cho tab icon-only nếu còn.

## Empty/edge
- 1 ngôn ngữ duy nhất → ẩn cả bộ chọn (no dead control).
- Tab bị khoá (locked) → giữ `muted` + glyph khoá như hiện tại, áp cho cả dropdown item.
