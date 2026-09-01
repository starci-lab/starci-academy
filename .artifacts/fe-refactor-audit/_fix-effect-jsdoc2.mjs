import fs from "node:fs"

const effects = [
    ["Bubbles", "Hollow bubbles rising from the bottom edge with a gentle wobble, tinted by the accent color."],
    ["Ember", "Warm embers drifting upward from a glow pooled at the bottom edge (the app's original ambient look)."],
    ["Fireflies", null],
    ["Rain", null],
    ["Snow", null],
    ["Stars", null],
]

for (const [name] of effects) {
    const rel = `src/components/blocks/layout/AmbientBackground/effects/${name}Effect.tsx`
    let src = fs.readFileSync(rel, "utf8")
    // Capture orphaned descriptive JSDoc sitting above the Props interface
    const re = /\/\*\* ([^*]+?) \*\/\r?\n\/\*\* Props for \{\@link \w+\}.\ \*\/\r?\ninterface /
    const m = src.match(re)
    if (!m) {
        console.log("no match", rel, JSON.stringify(src.slice(0, 200)))
        continue
    }
    const desc = m[1]
    src = src.replace(re, "/** Props for {@link " + name + "Effect}. */\ninterface ")
    src = src.replace(
        new RegExp(`(export const ${name}Effect =)`),
        `/** ${desc} */\n$1`,
    )
    fs.writeFileSync(rel, src)
    console.log("fixed", rel)
}

// TabPane: move JSDoc below interface
{
    const rel = "src/components/blocks/rendering/MarkdownContent/TabsBlock/index.tsx"
    let src = fs.readFileSync(rel, "utf8")
    src = src.replace(
        /\/\*\*\r?\n \* One pane inside[\s\S]*?\*\/\r?\ninterface TabPaneProps \{[\s\S]*?\}\r?\n\r?\nexport const TabPane =/,
        `interface TabPaneProps {
    kind: "code" | "preview"
    children?: React.ReactNode
}

/**
 * One pane inside a \`:::tab\` block: the source code (\`:::code\` -> fence Shiki) or the live
 * demo (\`:::preview\` -> MDX render). It only renders its children (the fence rendered by the
 * normal \`pre\` handler); {@link TabsBlock} identifies which pane is which by the original directive
 * tag name (\`tabcode\`/\`tabpreview\`), not by this prop.
 */
export const TabPane =`,
    )
    fs.writeFileSync(rel, src)
    console.log("fixed TabPane jsdoc")
}
