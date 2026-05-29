# 07 — Modals (rules theo loại)

Chốt từ feedback. 2 loại modal: **small** (form/picker) và **full-size** (split view). Ví dụ thật: `modals/AuthenticationModal/.../CredentialsState` (small chuẩn), `modals/PaymentModal` (small), `modals/ChallengeModal` (full).

## A. Small modal (form / picker) — CHUẨN theo modal login
Dùng cho: đăng nhập, chọn phương thức, form ngắn, confirm.
- `Modal.Container size="xs"`.
- **Header: title bên TRÁI + subtitle** (KHÔNG center, KHÔNG to/bold). `pr-8` chừa chỗ nút close (title dài không bị `×` che):
  ```tsx
  <Modal.Header>
    <div className="pr-8">
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-xs text-muted">{subtitle}</div>
    </div>
  </Modal.Header>
  ```
- **Divider có nhãn (song song)** để chia nhóm — KHÔNG dùng eyebrow uppercase lệch trái:
  ```tsx
  <div className="flex items-center justify-center gap-2">
    <Separator className="flex-1" />
    <div className="text-xs text-muted">{label}</div>   {/* normal case, KHÔNG all-caps */}
    <Separator className="flex-1" />
  </div>
  ```
- **List option/method = dính liền, bo góc ngoài, Separator chia trong** (KHÔNG card rời có gap):
  ```tsx
  <div className="flex flex-col overflow-hidden rounded-large">
    {items.map((it, index) => (
      <React.Fragment key={it.id}>
        <Card className="rounded-none bg-default/40 shadow-none ...">…</Card>
        {index !== items.length - 1 ? <Separator /> : null}
      </React.Fragment>
    ))}
  </div>
  ```
- Nút chính: `Button variant="primary" fullWidth` (bo tròn theo HeroUI). Nút OAuth/secondary: full-width.
- Spacing: `<div className="h-3" />` giữa các block; `Modal.Body` `p-3`.

## B. Full-size modal — split view
Dùng cho: làm bài/nội dung nặng (challenge, editor).
- `Modal.Container size="full"`; header center: title + chip phụ (vd score/difficulty).
- Body `grid grid-cols-1 lg:grid-cols-5` (trái 2 / phải 3), cao `lg:h-[calc(100vh-80px)]`.
- Title ở đây **được to hơn** (nội dung nặng, không phải form ngắn).
- Ví dụ: `modals/ChallengeModal`.

## C. Rule chung mọi modal
- **Container modal/form bo `rounded-3xl`** (form rounded chung của StarCi). List option bên trong bo viền ngoài = radius button (`rounded-medium`) + `Separator` (xem dưới).
- **Label/section KHÔNG all-caps** → normal case (theo rule nội dung). Eyebrow uppercase chỉ khi là badge nhấn có chủ ý (xem 05).
- **Bo góc**: list bo ở viền **ngoài** (`overflow-hidden rounded-large`), item bên trong `rounded-none` + `Separator` — không bo từng item rời.
- Title dài phải tránh đụng `Modal.CloseTrigger` (thêm padding phải / `truncate` / rút gọn).
- Heading modal nhỏ: `font-semibold text-lg` (KHÔNG `text-2xl font-bold`).
- i18n cho mọi text; đẹp ở cả light + dark (token semantic).
