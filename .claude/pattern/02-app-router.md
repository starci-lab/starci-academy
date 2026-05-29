# 02 — App Router

`src/app/` dùng Next.js 16 App Router (RSC mặc định, `"use client"` khi cần state/hook).

## Cấu trúc
```
app/
├─ layout.tsx          # root layout (html/body, providers gốc)
├─ InnerLayout.tsx     # layout con (ráp provider chain, navbar…)
├─ globals.css         # Tailwind v4 entry + global styles
├─ favicon.ico
└─ [locale]/           # mọi route nằm dưới prefix locale (next-intl)
   ├─ layout.tsx       # locale layout (set i18n context)
   ├─ page.tsx         # landing
   ├─ admin/           # khu admin (upload video, mpeg-dash test, login…)
   ├─ authentication/  # google/keycloak login callback…
   ├─ checkout/        # thanh toán
   ├─ contact/  contents/  courses/  headhunting-companies/
   ├─ profile/         # vd: profile/ai-settings/page.tsx
   └─ user/
```

## Quy ước
- **`page.tsx` chỉ return 1 component** từ `components/` (vd `return <AiSettingsPage />`). KHÔNG UI/logic/hook/fetch inline trong route file. `layout.tsx` chỉ ráp provider/shell. Mọi thứ đẩy vào `components/layouts` + hook.
- Route segment = folder + `page.tsx`. Layout lồng = `layout.tsx` trong segment.
- URL luôn có locale prefix → build URL bằng `pathConfig()` (xem 10), KHÔNG hardcode string.
- Component cần hook/redux/swr → `"use client"`. Component thuần render data từ server → để RSC.
- Block UI lớn của trang đặt ở `components/layouts/<Name>`, page chỉ ráp lại.
