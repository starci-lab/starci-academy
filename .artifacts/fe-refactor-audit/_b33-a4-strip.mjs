/**
 * B33 agent-4: strip dead StackH/StackV props when `principle` is set.
 * Stack does not forward gap/padding/align/justify/classNames with principle.
 */
import fs from "node:fs"

const files = [
    ".storybook/components/composites/viewers/MarkdownContent/MermaidDiagram.tsx",
    ".storybook/components/starci/blocks/learn/MindMapRail/MindMapRail.tsx",
    ".storybook/components/starci/blocks/navigation/NavLinks/NavLinks.tsx",
    ".storybook/components/starci/layouts/LearnShell/LearnShell.tsx",
    ".storybook/components/starci/pages/CourseContents/_shared.tsx",
    ".storybook/components/starci/pages/MindMapPage/MindMapPage.tsx",
    ".storybook/components/starci/pages/PlaygroundSessionPage/PlaygroundSessionPage.tsx",
    "src/components/blocks/cards/PressableCard/index.tsx",
    "src/components/blocks/learn/lesson/ContentTabBar/TabTrigger/index.tsx",
    "src/components/blocks/learn/personal-project/TaskSubmissionPanel/index.tsx",
    "src/components/blocks/navigation/NavLinks/index.tsx",
    "src/components/blocks/profile/ProfileLockedState/index.tsx",
    "src/components/composites/navigation/Toolbar/index.tsx",
    "src/components/composites/viewers/MarkdownContent/MermaidDiagram.tsx",
    "src/components/layouts/Navbar/AccountMenuDropdown/index.tsx",
    "src/components/pages/AdminAiBalancerPage/AdminAiBalancerSkeleton/index.tsx",
    "src/components/pages/BlogListPage/StartHereAnchor/index.tsx",
    "src/components/pages/BlogPostPage/RelatedPosts/index.tsx",
    "src/components/pages/DashboardPage/DashboardIdentity/ProfileMenuCard/index.tsx",
    "src/components/pages/DashboardPage/DashboardTabsBar/index.tsx",
    "src/components/pages/DashboardPage/LeagueTierBadge/index.tsx",
    "src/components/pages/LeaguePage/index.tsx",
    "src/components/pages/LoginPage/index.tsx",
    "src/components/pages/MindMapPage/component.tsx",
    "src/components/pages/PracticeHubPage/index.tsx",
    "src/components/pages/PracticeProblemPage/PracticeProblemSkeleton/index.tsx",
    "src/components/pages/ProfileOverviewPage/index.tsx",
    "src/components/pages/RewardsPage/index.tsx",
    "src/components/pages/SepayCheckoutPage/OrderSummary/index.tsx",
    "src/components/pages/SystemStatusPage/AiKeyGroup/index.tsx",
    "src/components/pages/SystemStatusPage/ComponentCard/index.tsx",
    "src/components/pages/SystemStatusPage/SystemStatusSkeleton/index.tsx",
]

const DEAD = new Set(["gap", "padding", "align", "justify", "classNames"])

function stripDeadProps(source) {
    let changed = false
    const out = []
    let i = 0
    const lines = source.split(/\n/)

    while (i < lines.length) {
        const open = lines[i].match(/^(\s*)<(StackH|StackV)\b(.*)$/)
        if (!open) {
            out.push(lines[i])
            i++
            continue
        }

        const indent = open[1]
        const tag = open[2]
        // Collect opening tag lines until `>` that closes the start tag
        const start = i
        let chunk = lines[i]
        let depth = 0
        let endLine = i
        let endCol = -1
        for (let li = i; li < Math.min(lines.length, i + 40); li++) {
            const line = li === i ? lines[li] : lines[li]
            for (let j = li === i ? lines[li].indexOf("<") : 0; j < line.length; j++) {
                const c = line[j]
                if (c === "{") depth++
                else if (c === "}") depth--
                else if (c === ">" && depth === 0) {
                    endLine = li
                    endCol = j
                    break
                }
            }
            if (endCol >= 0) break
            if (li > i) chunk += "\n" + lines[li]
        }

        if (endCol < 0) {
            out.push(lines[i])
            i++
            continue
        }

        const full = lines.slice(start, endLine + 1)
        const joined = full.join("\n")
        if (!/\bprinciple=/.test(joined)) {
            for (let k = start; k <= endLine; k++) out.push(lines[k])
            i = endLine + 1
            continue
        }

        // Rebuild: keep tag open line attributes minus dead props
        const rebuilt = []
        for (let li = start; li <= endLine; li++) {
            let line = lines[li]
            // Remove dead prop assignments (simple and multiline-safe enough for our files)
            const before = line
            // single-line prop forms: gap={...} align="..." classNames={...} classNames={classNames}
            line = line.replace(
                /^\s*(gap|padding|align|justify|classNames)=\{[^}]*\}\s*$/gm,
                "",
            )
            line = line.replace(
                /^\s*(gap|padding|align|justify)=("[^"]*"|'[^']*'|\{[^}]*\})\s*$/gm,
                "",
            )
            // inline on same line as other attrs
            line = line.replace(
                /\s(gap|padding|align|justify|classNames)=\{[^}]*\}/g,
                "",
            )
            line = line.replace(
                /\s(gap|padding|align|justify)=("[^"]*"|'[^']*')/g,
                "",
            )
            // empty lines that only had whitespace after removal
            if (line.trim() === "" && before.trim() !== "") {
                changed = true
                continue
            }
            if (line !== before) changed = true
            rebuilt.push(line)
        }

        // Drop blank lines inside the tag attrs
        const cleaned = rebuilt.filter((l, idx) => {
            if (idx === 0) return true
            if (l.trim() === "" && idx < rebuilt.length - 1) return false
            return true
        })

        out.push(...cleaned)
        i = endLine + 1
    }

    return { text: out.join("\n"), changed }
}

let n = 0
for (const f of files) {
    if (!fs.existsSync(f)) {
        console.log("missing", f)
        continue
    }
    const src = fs.readFileSync(f, "utf8")
    const { text, changed } = stripDeadProps(src)
    if (changed && text !== src) {
        fs.writeFileSync(f, text)
        console.log("stripped", f)
        n++
    } else {
        console.log("noop", f)
    }
}
console.log("updated", n)
