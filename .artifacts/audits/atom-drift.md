# Audit - block/screen vong qua tang ATOM

> Sinh tu dong 2026-07-25. Quet `.storybook/components/{blocks,screens}/**/*.tsx`,
> tim import lay THANG component tu `@heroui/react` trong khi DA CO atom tuong ung.
> `cn` khong tinh (ham tien ich). `Card`/`CardContent`/`Table`/`Link`/`ScrollShadow`
> khong tinh - chua co atom, muon don thi phai dung atom truoc.

**Tong: 128 diem cham / 16 symbol / 191 file da quet.**

| Symbol lay raw | So diem | Atom da co, dang ra phai dung |
|---|---|---|
| `Typography` | 76 | Typography.Xs/Sm/Base/Lg  (atoms/text/Typography) |
| `Button` | 8 | Button.Base/Icon/Group  (atoms/buttons/Button) |
| `Tabs` | 6 | Tabs.Base  (atoms/navigation/Tabs) |
| `Chip` | 5 | Chip.Base/Dot  (atoms/chips/Chip) |
| `TextField` | 5 | Input.Text/...  (atoms/forms/Input) |
| `Spinner` | 4 | Spinner.Base  (atoms/display/Spinner) |
| `Tooltip` | 4 | Tooltip.Base  (atoms/overlay/Tooltip) |
| `Popover` | 3 | Popover.Base  (atoms/overlay/Popover) |
| `Radio` | 3 | Choice.Radio  (atoms/forms/Choice) |
| `RadioGroup` | 3 | Choice.RadioGroup  (atoms/forms/Choice) |
| `Switch` | 3 | Choice.Switch  (atoms/forms/Choice) |
| `Accordion` | 2 | Accordion.Base  (atoms/navigation/Accordion) |
| `Checkbox` | 2 | Choice.Checkbox  (atoms/forms/Choice) |
| `Select` | 2 | Select.Single/Multi/Combobox  (atoms/forms/Select) |
| `Avatar` | 1 | Avatar.Base/Group  (atoms/display/Avatar) |
| `Badge` | 1 | Badge.Base  (atoms/display/Badge) |

## Uu tien

1. **`Typography` (76)** - o lon nhat. Moi block tu goi `<Typography type=... color=...>`
   nen quyet dinh typography nam rai rac thay vi o atom. Lan nang: can soi mat nhieu man.
2. **Nhom nho (Button/Tabs/Chip/Tooltip/Spinner/Popover/Accordion/Avatar/Badge)** - rui ro thap,
   moi cai verify duoc doc lap.
3. **`Switch`/`Radio`/`RadioGroup`/`Checkbox`** - nam trong atom `Choice`, ten khong trung nen phai ra tay.

## Cham trang thai tu ve (khong qua `Chip.Dot`)

Thay chot 2026-07-25: **tuan thu tuyet doi `Chip.Dot`**. Cac diem duoi tu ve `span.rounded-full`:

| File | Dong | Danh gia |
|---|---|---|
| `blocks/marketing/TrackCard/TrackCard.tsx` | 81 | **CAN DON** - cham phan loai track co nhan kem = dung ca `Chip.Dot bare` |
| `blocks/grading/GradeModelDropdown/GradeModelDropdown.tsx` | 150 | **CAN XEM** - cham success/danger lam icon, khong co nhan kem |
| `blocks/notifications/NotificationItem/NotificationItem.tsx` | 153 | **CAN XEM** - cham "chua doc", khong co nhan kem |
| `blocks/marketing/ShowcaseMockup/ShowcaseMockup.tsx` | 187-189 | BO QUA - 3 cham gia cua so mac, trang tri |
| `blocks/feed/ChatPanel/ChatPanel.tsx` | 126 | BO QUA - typing indicator (cham nhay) |
| `blocks/chips/StatusChip/StatusChip.tsx` | 124 | BO QUA - nut x tron, khong phai cham |
| `blocks/feed/ActivityAvatar/ActivityAvatar.tsx` | 58 | BO QUA - avatar tron |
| `blocks/identity/AvatarUploadButton/AvatarUploadButton.tsx` | 79 | BO QUA - avatar tron |

## Da don xong (2026-07-25)

- `Feedback.Callout` + `Toast.Base` deu cat thang vao HeroUI `Alert` -> gop ve atom `Alert.Base`.
- Block `DotChip` tu ve cham+nhan song song voi atom -> XOA, gop vao `Chip.Dot variant="bare"`.
  `DifficultyChip`/`AiCategoryChip`/`LanguageChip` gio goi thang atom.
- Namespace block `chips/Chip` bo member `Dot` (trung ten khac tier voi atom).
- Screen `CourseContents` sach atom hoan toan: `CourseBrief` + `KeepGoingPath` gom lai.

## Chua co atom (muon don phai dung truoc)

`Card` / `CardContent` (20 diem) - surface dang thuoc block `SurfaceCard`.
`Table` (3) - `Table.Base` hien la block. `Link` (4). `ScrollShadow` (6). `Label` (6). `Slider` (2).

> Luu y: 1 file doc bi loi encode, da doc voi errors=replace.
