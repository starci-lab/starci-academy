# Flowbook

**Storybook shows one *component* in all its states. Flowbook shows one *feature* as all its screens** — a static storyboard of every screen in a flow, hand-drawn with the app's design system (HeroUI v3 + the Tailwind v4 `globals.css` tokens) in a throwaway Vite app. It does **not** import the app's feature/block components from `src`, so it carries no redux/socket/data harness — the screens are redrawn.

## Run

```bash
npm run flowbook        # dev server on http://localhost:6007
npm run flowbook:build  # type/build check
```

Storybook (`npm run storybook`, 6006) and Flowbook (6007) sit side by side.

## How it reuses the design system (without importing components)

| Concern | How |
|---|---|
| Look & feel | Imports the app's `src/app/globals.css` (Tailwind v4 + `@heroui/styles`) — same tokens, same theme. |
| Primitives | Built from `@heroui/react` (Button, Typography, Chip, ScrollShadow…) — the design system, not app components. |
| Providers | `FlowbookProviders` mirrors the app's `HeroUIProvider` (HeroUI `I18nProvider`) on a themed `@container`. |
| App components | **None imported.** Screens are redrawn so the prototype needs no data/store/socket. The only `@` reference is `globals.css`. |

## Flows

### `chat` — Content-AI (14 screens)

A faithful redraw of `src/components/features/learn/ContentAiChat` + its lesson host, as one storyboard:

1. Vô bài học (host + "Hỏi AI" + đoạn bôi đen)
2. Chat rỗng · 3. Đang soạn · 4. Bôi đen đoạn → hỏi
5. Đang gửi · 6. Đang trả lời (stream) · 7. Đã trả lời + nguồn
8. Lỗi · 9. Hết lượt AI
10. Tìm nội dung / quiz · 11. Lịch sử trò chuyện · 12. Đổi tên hội thoại
13. Menu kỹ năng · 14. Chọn model

Files: `flows/chat/ChatFlow` (the storyboard), `ContentAiChatMock` (the rail screens), `LessonScreen` (host page), `fixtures.ts` (data). Each screen notes the Storybook story that documents the same surface in isolation.

## Add a flow

1. Draw the screens as a presentational component (HeroUI primitives, no `@/` component imports).
2. `flows/<name>/<Name>Flow` — lay the screens out as a storyboard.
3. Register it in `App/index.tsx`'s `FLOWS` array.
