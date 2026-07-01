# Draft — Toolbar 2 nhóm tab: nhóm PHỤ (preference đặt-1-lần) thu thành DROPDOWN trên mobile, nhóm CHÍNH giữ nhãn (2026-06-27)

- File/§ đích khi `/merge`: `starci-navigation.md` (TabsCard) + liên quan [[tabscard-two-secondary-groups]] · [[single-select-among-options-use-tabs]] · [[master-detail-rail-as-filter-and-mobile-chips]] (mobile collapse) · [[when-drawer]].
- Bối cảnh: lesson reader `ContentTabBar` (block `TabsCard`) — 1 hàng 2 nhóm tab: trái = Nội dung/Thử thách (nav chính), phải = bộ chọn ngôn ngữ TS/Java/C#/Go. Màn hẹp/mobile → 2 nhóm chen 1 hàng chật. Thầy duyệt Hướng B.

## Luật (STRICT)
- **Toolbar có 2 nhóm tab mà 1 nhóm là PREFERENCE "đặt-1-lần" (language/version/đơn vị…) → trên mobile THU nhóm phụ đó thành 1 DROPDOWN (`Select`), nhóm CHÍNH (nav đổi body) GIỮ NGUYÊN tabs + NHÃN.** Phân vai: PRIMARY nav = rõ + 1 chạm + giữ nhãn; SECONDARY preference = thu gọn khi chật (đổi ít, 2 chạm chấp nhận được). Là convention chuẩn của docs/code-reader (Stripe API docs · Mintlify · Docusaurus để language/version selector thành dropdown trên mobile).
- **KHÔNG icon-only-hoá nhóm nav chính trên mobile** (book/puzzle 1 mình mơ hồ) — chỉ thu nhóm phụ. KHÔNG cuộn ngang toolbar (khó chịu), KHÔNG xếp 2 hàng (tốn chiều cao) trừ khi nhóm phụ cũng cần luôn-hiện.
- **Implement ở BLOCK, opt-in qua prop** — `TabsCard` có prop **`collapseRightOnMobile`**: mobile (`sm:hidden`) render `rightTabs` thành `Select` (trigger = item đang chọn icon+label + `Select.Indicator`; options = `ListBox.Item` giữ `isDisabled`); `sm+` (`hidden sm:block`) render inline tabs như cũ. Đọc CÙNG group data (items/selectedKey/onSelectionChange) → 1 nguồn. Feature chỉ bật cờ; mặc định KHÔNG collapse (FeedTabs giữ inline). Style ở block.
- **Gotcha HeroUI `Select.onSelectionChange` trả `Key | null`** (null khi bỏ chọn) → guard `if (key !== null)` trước khi gọi `group.onSelectionChange(key: Key)` (lỗi tsc TS2345 nếu không).
- **a11y:** `Select.Trigger`/`ListBox.Root` nhận `aria-label = group.ariaLabel`; `ListBox.Item` cần `textValue` (string) cho typeahead/screen-reader — label node → `typeof label === "string" ? label : key`.

## Áp đầu (2026-06-27)
- `TabsCard` thêm `collapseRightOnMobile` (Select mobile / tabs sm+). `ContentTabBar` bật cờ; content tabs giữ nhãn (`TabTrigger` không sr-only). Doc: `ContentTabBar/RESPONSIVE-BRAINSTORM.md`. tsc/eslint sạch.
