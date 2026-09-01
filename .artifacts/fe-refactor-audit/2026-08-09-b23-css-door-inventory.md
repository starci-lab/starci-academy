# BATCH 23 — CSS-door inventory (`no-public-classname-prop`)

**Scope:** `src/components/**`, `.storybook/components/**`  
**Total:** 2492 hits / 936 files  
**Rule change this batch:** none (allowlist untouched; severity not raised)

## Buckets

| Bucket | Hits | Files |
|---|---:|---:|
| `vendor-boundary` | 0 (by design) | allowlisted, not visited |
| `locked` | 57 | 12 |
| `teacher-hold` | 15 | 7 |
| `live-api` | 1568 | 777 |
| `ratchet-ready` | 852 | 341 |
| `ambiguous` | 0 | 0 |

## Ratchet readiness

- **Not ready** to flip `no-public-classname-prop` to `error` while `live-api` declarations remain (1568 hits / 777 files).
- `ratchet-ready` (852 hits) are call-sites that become migrate-or-delete work after owning doors close.
- Do not add eslint-disable to hide debt.
- Vendor allowlist stays for Box + HeroUI Modal/Drawer/Popover/Tooltip/Select/ListBox/Table/AlertDialog/ButtonGroup.
- Nivo/Nivoexpert classname hits in this inventory: **0** (product trees still out of house CSS-door batches).

## Locked files (12)

- `src/components/blocks/learn/ContentAiChat/ContentAiChatModeSwitch/index.tsx`
- `src/components/blocks/learn/ContentAiChat/ContentAiChatRail/index.tsx`
- `src/components/blocks/learn/ContentAiChat/ContentAiScopePill/index.tsx`
- `src/components/blocks/learn/ContentAiChat/index.tsx`
- `src/components/blocks/marketing/ArchitectureScene/index.tsx`
- `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/component.tsx`
- `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/index.tsx`
- `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizStats/component.tsx`
- `src/components/pages/FlashcardsPage/QuizSession/QuizSessionSkeleton/index.tsx`
- `src/components/pages/FlashcardsPage/QuizSession/index.tsx`
- `src/components/pages/LandingPage/LearnLoopScroll/index.tsx`
- `src/components/pages/MockInterviewPage/MockInterviewSession/index.tsx`

## Live API sample (first 40)

- `.storybook/components/atoms/buttons/Button/ButtonBase.tsx`
- `.storybook/components/atoms/chips/Chip/ChipBase.tsx`
- `.storybook/components/atoms/display/Avatar/AvatarBase.tsx`
- `.storybook/components/atoms/display/Badge/Badge.tsx`
- `.storybook/components/atoms/display/Divider/Divider.tsx`
- `.storybook/components/atoms/display/IconTile/IconTile.tsx`
- `.storybook/components/atoms/display/Logo/Logo.tsx`
- `.storybook/components/atoms/display/Progress/Progress.tsx`
- `.storybook/components/atoms/display/SnippetIcon/SnippetIcon.tsx`
- `.storybook/components/atoms/display/Spinner/Spinner.tsx`
- `.storybook/components/atoms/display/StepBadge/StepBadge.tsx`
- `.storybook/components/atoms/display/ThreadConnector/ThreadConnector.tsx`
- `.storybook/components/atoms/feedback/Alert/Alert.tsx`
- `.storybook/components/atoms/feedback/ReactionPicker/ReactionPicker.tsx`
- `.storybook/components/atoms/forms/ChoiceCheckbox/ChoiceCheckbox.tsx`
- `.storybook/components/atoms/forms/ChoiceRadio/ChoiceRadio.tsx`
- `.storybook/components/atoms/forms/ChoiceSwitch/ChoiceSwitch.tsx`
- `.storybook/components/atoms/forms/InputCurrency/InputCurrency.tsx`
- `.storybook/components/atoms/forms/InputDate/InputDate.tsx`
- `.storybook/components/atoms/forms/InputNumber/InputNumber.tsx`
- `.storybook/components/atoms/forms/InputOtp/InputOtp.tsx`
- `.storybook/components/atoms/forms/InputPassword/InputPassword.tsx`
- `.storybook/components/atoms/forms/InputSearch/InputSearch.tsx`
- `.storybook/components/atoms/forms/InputText/InputText.tsx`
- `.storybook/components/atoms/forms/InputTextarea/InputTextarea.tsx`
- `.storybook/components/atoms/forms/InputTime/InputTime.tsx`
- `.storybook/components/atoms/forms/SearchAutocomplete/SearchAutocomplete.tsx`
- `.storybook/components/atoms/forms/SelectCombobox/SelectCombobox.tsx`
- `.storybook/components/atoms/forms/SelectMulti/SelectMulti.tsx`
- `.storybook/components/atoms/forms/SelectSingle/SelectSingle.tsx`
- `.storybook/components/atoms/forms/_input/FieldSkeleton.tsx`
- `.storybook/components/atoms/forms/_input/types.ts`
- `.storybook/components/atoms/forms/_select/TriggerSkeleton.tsx`
- `.storybook/components/atoms/forms/_select/types.ts`
- `.storybook/components/atoms/media/CoverImage/CoverImage.tsx`
- `.storybook/components/atoms/media/Image/Image.tsx`
- `.storybook/components/atoms/media/QRCode/QRCode.tsx`
- `.storybook/components/atoms/navigation/Accordion/Accordion.tsx`
- `.storybook/components/atoms/navigation/Breadcrumbs/Breadcrumbs.tsx`
- `.storybook/components/atoms/navigation/Link/LinkBack.tsx`
