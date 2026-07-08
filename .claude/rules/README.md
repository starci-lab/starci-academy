# ⚠️ This repo has NO design/engineering rules of its own — do not write here

The canonical FE design-system rules ("**v2**": `concepts/`, `elements/`, `layouts/`, `responsives/`,
`debts/`) live in a **DIFFERENT repo**: `D:\Repositories\starci-academy-backend\.claude\rules\`. That is
the ONLY canonical rule tree for this app's UI/design system + engineering conventions, even though
this repo (`starci-academy`) is where the app code actually lives.

**If you are about to write a rule, a draft, or ANY `.md` file under `.claude/rules/` in THIS repo — stop.**
It has no `concepts/`/`elements/`/`layouts/` to fold into locally; a file created here is an isolated
dead end nobody will read later. Go to `D:\Repositories\starci-academy-backend\.claude\rules\<concepts|elements|layouts|responsives>\<name>.md`
instead — read that repo's own `.claude/rules/README.md` for the full picture.

(A stray `.claude/rules/drafts/` folder with 13 files previously accumulated here by mistake — folded
into the backend repo's canonical tree and deleted, 2026-07-06. Don't let it recur — this `drafts/`
folder should stay empty.)

The FE-scoped skills you run FROM this repo's code (`starci-fe-ux-apply`, `starci-fe-ux-brainstorm`,
`starci-fe-layout-brainstorm`, `starci-fe-critique`, `/merge`) are themselves DEFINED in the backend
repo's `.claude/skills/` — any of their instructions to "update rules" mean the backend repo's tree,
never this one.
