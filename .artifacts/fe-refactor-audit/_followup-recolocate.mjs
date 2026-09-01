import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const toSrc = (s) =>
  s
    .replaceAll("@sb-components/", "@/components/")
    .replaceAll("@/components/atoms/forms/RadioGroup/RadioGroup", "@/components/atoms/forms/RadioGroup")

const pairs = [
  [".storybook/components/atoms/forms/ChoiceCheckbox/ChoiceCheckbox.tsx", "src/components/atoms/forms/ChoiceCheckbox/index.tsx"],
  [".storybook/components/atoms/forms/ChoiceSwitch/ChoiceSwitch.tsx", "src/components/atoms/forms/ChoiceSwitch/index.tsx"],
  [".storybook/components/atoms/forms/InputOtp/InputOtp.tsx", "src/components/atoms/forms/InputOtp/index.tsx"],
  [".storybook/components/atoms/forms/SearchAutocomplete/SearchAutocomplete.tsx", "src/components/atoms/forms/SearchAutocomplete/index.tsx"],
  [".storybook/components/composites/form/ChoiceRadioGroup/ChoiceRadioGroup.tsx", "src/components/composites/form/ChoiceRadioGroup/index.tsx"],
  [".storybook/components/composites/form/_field/FieldFrame.tsx", "src/components/composites/form/_field/FieldFrame.tsx"],
]

for (const [from, to] of pairs) {
  const out = toSrc(fs.readFileSync(path.join(ROOT, from), "utf8"))
  fs.writeFileSync(path.join(ROOT, to), out)
  console.log("wrote", to)
}

const del = [
  "src/components/atoms/forms/ChoiceCheckbox/ChoiceCheckboxSkeleton.tsx",
  "src/components/atoms/forms/ChoiceSwitch/ChoiceSwitchSkeleton.tsx",
  "src/components/atoms/forms/InputOtp/InputOtpSkeleton.tsx",
  "src/components/atoms/forms/SearchAutocomplete/SearchAutocompleteSkeleton.tsx",
  "src/components/composites/form/ChoiceRadioGroup/ChoiceRadioGroupSkeleton.tsx",
]
for (const f of del) {
  const abs = path.join(ROOT, f)
  if (fs.existsSync(abs)) {
    fs.unlinkSync(abs)
    console.log("deleted", f)
  }
}
