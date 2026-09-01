import fs from "node:fs"

const f = ".storybook/stories/composites/cards/SurfaceCard/SurfaceCardPressableGroup.stories.tsx"
let s = fs.readFileSync(f, "utf8")

s = s.replace(
    "code: \"<SurfaceCardPressableGroup gap={3} ariaLabel=\\\"Mentors\\\" columns={{ base: 1, sm: 2 }} items={[…].slice(0, 2)} />\"",
    "code: \"<SurfaceCardPressableGroup principle=\\\"sibling-stack\\\" ariaLabel=\\\"Mentors\\\" columns={{ base: 1, sm: 2 }} items={[…].slice(0, 2)} />\"",
)
s = s.replace(
    "render: <SurfaceCardPressableGroup ariaLabel=\"Mentors (gap step 3)\" columns={{ base: 1, sm: 2 }} gap={3} items={profileItems.slice(0, 2)} />",
    "render: <SurfaceCardPressableGroup ariaLabel=\"Mentors (sibling-stack)\" columns={{ base: 1, sm: 2 }} principle=\"sibling-stack\" items={profileItems.slice(0, 2)} />",
)
s = s.replace(
    "code: \"<SurfaceCardPressableGroup gap={4} ariaLabel=\\\"Mentors\\\" columns={{ base: 1, sm: 2 }} items={[…].slice(2)} />  // default\"",
    "code: \"<SurfaceCardPressableGroup principle=\\\"content-row\\\" ariaLabel=\\\"Mentors\\\" columns={{ base: 1, sm: 2 }} items={[…].slice(2)} />  // default\"",
)
s = s.replace(
    "render: <SurfaceCardPressableGroup ariaLabel=\"Mentors (gap step 4)\" columns={{ base: 1, sm: 2 }} gap={4} items={profileItems.slice(2)} />",
    "render: <SurfaceCardPressableGroup ariaLabel=\"Mentors (content-row)\" columns={{ base: 1, sm: 2 }} principle=\"content-row\" items={profileItems.slice(2)} />",
)
s = s.replace(
    "reason=\"gap is a prop of the group, never of an item, so the grid always keeps one even spacing across every cell instead of letting a single tile push its neighbours around.\"",
    "reason=\"principle owns the peer-card seam on the group Grid — sibling-stack (8px) or content-row (12px) — never a public gap prop.\"",
)
s = s.replace("leaf=\"Gap\"", "leaf=\"Principle\"")
s = s.replace("name: \"peers in one set\"", "name: \"principle = \\\"sibling-stack\\\"\"")
s = s.replace("name: \"rows inside one surface\"", "name: \"principle = \\\"content-row\\\" (default)\"")

fs.writeFileSync(f, s)
console.log("stories patched", s.includes("gap={3}"), s.includes("gap={4}"))
