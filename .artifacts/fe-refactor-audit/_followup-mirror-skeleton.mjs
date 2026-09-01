import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

const pairs = [
  [".storybook/components/composites/form/_field/FieldFrame.tsx", "src/components/composites/form/_field/FieldFrame.tsx"],
  [".storybook/components/atoms/forms/_input/FieldSkeleton.tsx", "src/components/atoms/forms/_input/FieldSkeleton.tsx"],
  [".storybook/components/atoms/forms/_input/types.ts", "src/components/atoms/forms/_input/types.ts"],
  [".storybook/components/atoms/forms/_select/types.ts", "src/components/atoms/forms/_select/types.ts"],
  [".storybook/components/atoms/forms/ChoiceCheckbox/ChoiceCheckbox.tsx", "src/components/atoms/forms/ChoiceCheckbox/index.tsx"],
  [".storybook/components/atoms/forms/ChoiceCheckbox/ChoiceCheckboxSkeleton.tsx", "src/components/atoms/forms/ChoiceCheckbox/ChoiceCheckboxSkeleton.tsx"],
  [".storybook/components/atoms/forms/ChoiceSwitch/ChoiceSwitch.tsx", "src/components/atoms/forms/ChoiceSwitch/index.tsx"],
  [".storybook/components/atoms/forms/ChoiceSwitch/ChoiceSwitchSkeleton.tsx", "src/components/atoms/forms/ChoiceSwitch/ChoiceSwitchSkeleton.tsx"],
  [".storybook/components/atoms/forms/InputOtp/InputOtp.tsx", "src/components/atoms/forms/InputOtp/index.tsx"],
  [".storybook/components/atoms/forms/InputOtp/InputOtpSkeleton.tsx", "src/components/atoms/forms/InputOtp/InputOtpSkeleton.tsx"],
  [".storybook/components/atoms/forms/SearchAutocomplete/SearchAutocompleteSkeleton.tsx", "src/components/atoms/forms/SearchAutocomplete/SearchAutocompleteSkeleton.tsx"],
  [".storybook/components/composites/form/ChoiceRadioGroup/ChoiceRadioGroup.tsx", "src/components/composites/form/ChoiceRadioGroup/index.tsx"],
  [".storybook/components/composites/form/ChoiceRadioGroup/ChoiceRadioGroupSkeleton.tsx", "src/components/composites/form/ChoiceRadioGroup/ChoiceRadioGroupSkeleton.tsx"],
]

const toSrc = (src) => src.replaceAll("@sb-components/", "@/components/")

for (const [from, to] of pairs) {
  const text = fs.readFileSync(path.join(ROOT, from), "utf8")
  const out = toSrc(text)
  fs.mkdirSync(path.dirname(path.join(ROOT, to)), { recursive: true })
  fs.writeFileSync(path.join(ROOT, to), out)
  console.log("wrote", to)
}

// SearchAutocomplete main file — patch skeleton slot
const sa = "src/components/atoms/forms/SearchAutocomplete/index.tsx"
let sat = fs.readFileSync(path.join(ROOT, sa), "utf8")
sat = sat.replace(/,\s*Skeleton as HeroSkeleton/, "")
sat = sat.replace(/Skeleton as HeroSkeleton,\s*/, "")
if (!sat.includes("SearchAutocompleteSkeleton")) {
  sat = sat.replace(
    'from "@/components/composites/form/_field/FieldFrame"',
    'from "@/components/composites/form/_field/FieldFrame"\nimport { SearchAutocompleteSkeleton } from "./SearchAutocompleteSkeleton"',
  )
  // also try sb-style if any
  sat = sat.replace(
    'from "@sb-components/composites/form/_field/FieldFrame"',
    'from "@/components/composites/form/_field/FieldFrame"\nimport { SearchAutocompleteSkeleton } from "./SearchAutocompleteSkeleton"',
  )
}
sat = sat.replace(/skeletonControl=\{[\s\S]*?\n\s*\}/, "skeletonControl={SearchAutocompleteSkeleton}")
fs.writeFileSync(path.join(ROOT, sa), sat)
console.log("patched", sa)

// Simple input/select/textarea/tags replacements in src
const simple = [
  ["src/components/atoms/forms/InputText/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputSearch/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputPassword/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputNumber/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputDate/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputTime/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/InputCurrency/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
  ["src/components/atoms/forms/SelectSingle/index.tsx", "skeletonControl={<TriggerSkeleton />}", "skeletonControl={TriggerSkeleton}"],
  ["src/components/atoms/forms/SelectMulti/index.tsx", "skeletonControl={<TriggerSkeleton />}", "skeletonControl={TriggerSkeleton}"],
  ["src/components/atoms/forms/SelectCombobox/index.tsx", "skeletonControl={<TriggerSkeleton />}", "skeletonControl={TriggerSkeleton}"],
  ['src/components/atoms/forms/InputTextarea/index.tsx', 'skeletonControl={<FieldSkeleton heightCls="h-24" />}', "skeletonControl={TextareaSkeleton}"],
  ["src/components/composites/form/InputTags/index.tsx", "skeletonControl={<FieldSkeleton />}", "skeletonControl={FieldSkeleton}"],
]

for (const [file, from, to] of simple) {
  const abs = path.join(ROOT, file)
  let t = fs.readFileSync(abs, "utf8")
  if (!t.includes(from)) {
    console.log("MISS", file, from)
    continue
  }
  t = t.replaceAll(from, to)
  if (file.includes("InputTextarea")) {
    t = t.replace(
      'import { FieldSkeleton } from "@/components/atoms/forms/_input/FieldSkeleton"',
      'import { TextareaSkeleton } from "@/components/atoms/forms/_input/FieldSkeleton"',
    )
    t = t.replace(
      'import { FieldSkeleton } from "@sb-components/atoms/forms/_input/FieldSkeleton"',
      'import { TextareaSkeleton } from "@/components/atoms/forms/_input/FieldSkeleton"',
    )
  }
  fs.writeFileSync(abs, t)
  console.log("ok", file)
}

// Update src forms index
const idx = path.join(ROOT, "src/components/atoms/forms/index.ts")
let index = fs.readFileSync(idx, "utf8")
index = index.replace(
  /export type \{ FrameProps, FieldSkeletonProps \} from "\.\/_input\/types"/,
  'export type { FrameProps } from "./_input/types"',
)
index = index.replace(
  /export \{ FieldSkeleton \} from "\.\/_input\/FieldSkeleton"/,
  'export { FieldSkeleton, TextareaSkeleton } from "./_input/FieldSkeleton"',
)
fs.writeFileSync(idx, index)
console.log("updated forms index")
