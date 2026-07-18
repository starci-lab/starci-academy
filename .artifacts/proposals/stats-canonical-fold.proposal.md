# Proposal — Stats Canonical Fold (bám Storybook + UI cũ)

> Status: ⏳ PENDING · Trigger: thầy `/starci-fe-layout "giữ layout này để brainstorm layout sát stories book hơn và ui cũ"`. GIỮ nội dung/zone của `stats-insight-redesign` đã build; ĐỔI **từ vựng block** cho sát canonical Storybook + nhịp UI cũ.

## Vấn đề
Bản redesign đã build chèn **2 block TỰ CHẾ** (`VerdictHeroCard`, `DeadlineCallout`) — không có trong Storybook, hand-roll `border-l-4` + vạch target. Lệch khỏi UI cũ (8 `LabeledCard` mỗi zone + primitive canonical) và hệ Storybook. `card.md §3i` **tự thú** đúng chỗ này: *"VerdictHeroCard vẽ border-l-4 bằng tay vì SectionCard chưa có asymmetric-border → chỗ canon còn thiếu"* — nhưng thực ra **`SectionCard withVerdict` ĐÃ có** (viền-trái band = data-signal), nên hand-roll là thừa.

## ★ Reconcile — nối tiếp `colored-left-border-card` (đã DONE, session khác)
BACKLOG có sẵn proposal `colored-left-border-card` ✅ DONE: thầy **chốt KHÔNG tạo block `ColoredLeftBorderCard` mới**, chỉ dùng field **`SectionCard withVerdict`** (đã migrate `RatingBar` + `WeeklyBoard`), và **HOÃN migrate `VerdictHeroCard`** vì lúc đó session khác đang viết story cho nó. ⇒ `stats-canonical-fold` **chính là hoàn tất phần bị hoãn đó** (VerdictHeroCard + DeadlineCallout → withVerdict) — KHÔNG phải ý mới, mà là dọn nốt migration đã duyệt. (Ghi chú BACKLOG: `card.md §3i` chữ "block ColoredLeftBorderCard" là STALE — sự thật là `withVerdict` field; prototype này dùng đúng `SectionCard withVerdict`, không tạo block.)

## Hướng chốt: fold về từ vựng canonical đã đặt tên
- **Về hưu** `VerdictHeroCard` + `DeadlineCallout` (2 block tự chế).
- **Thay bằng:** `LabeledCard` mỗi zone (nhịp UI cũ) + `SectionCard withVerdict={band}` (§3i, viền-trái DATA — prop CÓ SẴN) cho hero phán-xử + `Callout warning` (§3i) cho "sắp quên" + `ProgressMeter`/`SurfaceListCard`/`SegmentBar` (canonical, giữ nguyên).
- **`HighlightCard` (§3j)** — vòng hào quang quay ĐÃ có; TUỲ CHỌN bọc hero cho "nổi" (thuần trang trí, KHÔNG encode band — khác hẳn §3i data-signal).

## Prototype (bấm được)
`.artifacts/prototypes/stats-canonical-fold/index.html` — host `http://localhost:8080/`. Toggle **Bản** (Canonical mới ↔ Hero tự chế hiện tại) · **Glow §3j** (tắt/bật ở hero) · **Máy**. Mỗi zone gắn tên block + 🟩canon/🟥tự-chế.

## Zone → block (canonical fold)
| Zone | Bản MỚI (canonical) | Bản cũ (retire) |
|---|---|---|
| Sức khoẻ trí nhớ | `LabeledCard` + `SectionCard withVerdict="danger"` §3i (số lớn + verdict + `ProgressMeter` + 2 split surface-in-surface + Button) | `VerdictHeroCard` |
| Điểm yếu theo chủ đề | `LabeledCard` + `SurfaceListCard` | (giữ) |
| Sắp quên | `LabeledCard` + `Callout warning` §3i + forecast bars | `DeadlineCallout` |
| Độ chín | `LabeledCard` + `SegmentBar` inlineLabels | (giữ) |
| Leech | `LabeledCard` + `SurfaceListCard` | (giữ) |
| Thói quen | `LabeledCard` + chips + heatmap | (giữ) |

## Quyết định chờ thầy
1. **Full-fold** (inline `LabeledCard`+`SectionCard withVerdict` mỗi surface — sát UI cũ nhất, lặp composition 3× ở review/quiz/interview) **hay** **canonical-ize block** (giữ 1 block `VerdictHeroCard` nhưng dựng LẠI TRÊN `SectionCard withVerdict` + `ProgressMeter`, bỏ hand-roll — giữ DRY, đăng ký Storybook)? → prototype nghiêng full-fold; nếu muốn tái dùng thì chọn canonical-ize.
2. **Vạch target 85% trên meter**: thêm prop `target?` vào `ProgressMeter` (đúng chỗ canon thiếu, tái dùng mọi nơi) **hay** bỏ vạch, chỉ caption "mục tiêu 85%" trên meter?
3. **Glow §3j** bọc hero: bật hay không (thầy thích hiệu ứng quay này ở resume-card).

## Files to touch (khi build)
- FE: `FlashcardReviewStats` + `FlashcardQuizStats` + `MockInterviewStats` (đổi hero từ `VerdictHeroCard`→`SectionCard withVerdict`+composition; `DeadlineCallout`→`Callout`); xoá `blocks/stats/VerdictHeroCard` + `DeadlineCallout` (nếu full-fold) HOẶC rebuild internals (nếu canonical-ize); (opt) thêm `target` prop vào `blocks/stats/ProgressMeter`.
- Story: cập nhật/gỡ story `VerdictHeroCard`/`DeadlineCallout` (news) theo hướng chọn; `ProgressMeter` +state target.

## Bàn giao (3 thứ)
1. **Prototype**: `http://localhost:8080/` · file `.artifacts/prototypes/stats-canonical-fold/index.html`.
2. **Component → Storybook** (khi build):

| Component | Story | Mới/Sửa |
|---|---|---|
| `VerdictHeroCard`/`DeadlineCallout` | — | **Gỡ** (full-fold) hoặc **sửa** internals (canonical-ize) |
| `ProgressMeter` | `ProgressMeter.stories` | Sửa (+ state `target`) nếu chọn thêm vạch |
| `SectionCard` | `SectionCard.stories` | Sửa (+ demo `withVerdict` trong stats context) |

3. **Nguồn**: `.claude/fe/components/card.md §3i` (SectionCard withVerdict = ColoredLeftBorderCard) · `§3j` (HighlightCard) · `.artifacts/states/registry.md` (LabeledCard/SectionCard/Callout/ProgressMeter/SegmentBar) · UI cũ `git HEAD:FlashcardReviewStats/index.tsx:252` (LabeledCard+ProgressMeter) · `SectionCard/index.tsx` (withVerdict prop) · `HighlightCard/` (glow §3j đã có). KHÔNG web.
