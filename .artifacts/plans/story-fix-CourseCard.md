# Plan — story-fix CourseCard (Block/Cards)

> Ra từ `/starci-fe-story-fix-block-plan CourseCard` (2026-07-22). Chấm qua `.claude/fe/principles.md` §1 + §2, NHÌN dark render + ground code thật. **Chờ thầy duyệt trước khi `-apply`.**

## Bảng phát hiện

| | Vùng | §principle | Trạng thái / Fix |
|---|---|---|---|
| ✅ | enrollment "482 học viên" = muted text + icon | §2 meta chìm, không chip | Đã đúng (fix hôm nay). Giữ. |
| ✅ | giá: 1.341.000₫ bold foreground / 2.990.000₫ muted line-through | §2 cặp lệch cấp | Đúng. Giữ. |
| ✅ | 1 CTA solid accent + 1 secondary | §2 restraint, 1 nổi | Đúng. Giữ. |
| ❌ | **3 check XANH + chip −55% xanh + CTA hồng = 4 điểm nổi** | §2 restraint (60-30-10, 1 nổi/vùng) | **FIX: hạ 3 check → `text-muted`.** Chữ value-props dẫn; xanh chỉ còn ở deal −55%. Nổi còn 2 (giá-deal + CTA). |
| ⚠️ | chip −55% cùng xanh với check (deal vs gồm) | §2 va chạm ngữ nghĩa | Tự hết khi check→muted. Không cần đụng chip. |
| ⚠️ | surface-in-surface: `CrossListCard bordered` ở DARK | §1a nested=border | Border `border-default` — cần thầy soi mắt có đủ rõ ở dark không (nếu mờ → tăng contrast border). |
| ⚠️ | USD-line "≈ $58.99…" | §3 reading-flow (draft) | **Đính chính:** code là `Typography muted` KHÔNG `text-center` → thực ra neo TRÁI. Earlier tôi nghi "căn giữa" từ ảnh là NHẦM. Không phải bug. (Nếu render vẫn lệch → có CSS ẩn, cần đo.) |

## Fix chính (❌) + BLAST

**Đổi:** 3 dấu check trong value-props CourseCard: xanh → muted.

**Blast (quan trọng):** màu check nằm ở primitive `CrossListCard` (`MARK_ICON.check = text-success-soft-foreground`), **dùng chung** `PricingTable` + `ModalShell`. Ở PricingTable **green-check vs muted-cross = gồm/không-gồm** → **KHÔNG đổi global** (sẽ giết tương phản PricingTable).

**Cách fix LOCAL (đề xuất):** thêm prop `tone?: "success" | "muted"` (default `"success"`) vào `CrossListItem` → `MARK_ICON` chọn màu theo tone. CourseCard truyền `tone="muted"`; PricingTable giữ default `"success"`. Đụng: `CrossListCard.tsx` (thêm prop + 1 story state) + `CourseCard.tsx` (truyền tone). PricingTable KHÔNG đổi.

## Sau khi duyệt → `-apply`
- Apply fix trên (prop `tone` + CourseCard truyền muted).
- B4: render đủ states CourseCard + `<Label>` mỗi phase (Grid Discounted/Enrolled/No Cover/Loyalty Pending/Free/Line…) — hiện đã có 7 state, kiểm mỗi cái có Label + skeleton mirror + đối chiếu logic.
- Thêm story state cho `CrossListCard` prop `tone` mới (three-layer-sync).
