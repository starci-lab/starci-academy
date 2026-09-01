/**
 * BATCH 16 — SB SurfaceCard twin sync (CRLF-safe).
 */
import fs from "node:fs"

const path = ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx"
const before = fs.readFileSync(path, "utf8")
let s = before

const identityPropBlock =
  "    /**\r\n" +
  "     * Caller identity to wear on this composite's root instead of its own — pass this\r\n" +
  "     * when a block/layout/overlay/page uses this composite as its root element.\r\n" +
  "     * Omitted → this composite keeps emitting its own data-tier/data-component.\r\n" +
  "     */\r\n" +
  "    identity?: CallerIdentity\r\n"

const nl = s.includes("\r\n") ? "\r\n" : "\n"

// Dead titleClassName — prop, destructure, unwrap div
s = s.replace(
  /\r?\n    \/\*\* Extra className on the title's own Typography \(e\.g\. a selected-row colour\)\. \*\/\r?\n    titleClassName\?: string/,
  "",
)
s = s.replace(/\r?\n        titleClassName,/, "")
s = s.replace(
  new RegExp(
    String.raw`\(\) => \(\r?\n` +
      String.raw`                        <div className=\{titleClassName\}>\r?\n` +
      String.raw`                            <Typography size="sm"\r?\n` +
      String.raw`                                truncate\r?\n` +
      String.raw`                                isSkeleton=\{isSkeleton\}\r?\n` +
      String.raw`                                underlineOnGroupHover=\{underlineHover\}\r?\n` +
      String.raw`                                text=\{title\}\r?\n` +
      String.raw`                            />\r?\n` +
      String.raw`                        </div>\r?\n` +
      String.raw`                    \)`,
  ),
  `() => (${nl}` +
    `                        <Typography size="sm"${nl}` +
    `                            truncate${nl}` +
    `                            isSkeleton={isSkeleton}${nl}` +
    `                            underlineOnGroupHover={underlineHover}${nl}` +
    `                            text={title}${nl}` +
    `                        />${nl}` +
    `                    )`,
)

const members = [
  "SurfaceCardNested",
  "SurfaceCardPressableGroup",
  "SurfaceCardSelectableGroup",
  "SurfaceCardList",
  "SurfaceCardAccordion",
  "SurfaceCardCrossList",
  "SurfaceCardPlaceholder",
]

for (const name of members) {
  const resolve = `{...resolveIdentity(identity, { tier: "composite", name: "${name}" })}`
  // multiline with various indent
  s = s.replace(
    new RegExp(`data-tier="composite"\\r?\\n(\\s*)data-component="${name}"`, "g"),
    resolve,
  )
  s = s.replaceAll(`data-tier="composite" data-component="${name}"`, resolve)
}

const propTypes = [
  "SurfaceCardNestedProps",
  "SurfaceCardPressableGroupProps",
  "SurfaceCardSelectableGroupProps",
  "SurfaceCardListProps",
  "SurfaceCardAccordionProps",
  "SurfaceCardCrossListProps",
  "SurfaceCardPlaceholderProps",
]

for (const typeName of propTypes) {
  const startIface = s.indexOf(`export interface ${typeName}`)
  const startType = s.indexOf(`export type ${typeName}`)
  const startAt = startIface >= 0 ? startIface : startType
  if (startAt < 0) {
    console.error("missing type", typeName)
    continue
  }
  const slice = s.slice(startAt, startAt + 4500)
  if (slice.includes("identity?: CallerIdentity")) continue

  const classNamesRe = /classNames\?: Array<AllowedClassName>\r?\n/g
  let last = null
  let m
  while ((m = classNamesRe.exec(slice)) !== null) last = m
  if (!last) {
    console.error("no classNames in", typeName)
    continue
  }
  const abs = startAt + last.index + last[0].length
  s = s.slice(0, abs) + identityPropBlock + s.slice(abs)
}

for (const typeName of propTypes) {
  let idx = 0
  while (true) {
    const hit = s.indexOf(`}: ${typeName})`, idx)
    if (hit < 0) break
    const prior = s.slice(Math.max(0, hit - 500), hit)
    if (!/\bidentity,/.test(prior)) {
      s = s.slice(0, hit) + `    identity,${nl}` + s.slice(hit)
      idx = hit + 20
    } else {
      idx = hit + typeName.length + 3
    }
  }
}

const hardLeft = [...s.matchAll(/data-tier="composite"/g)].length
const resolveCount = [...s.matchAll(/resolveIdentity\(identity/g)].length
const titleLeft = [...s.matchAll(/titleClassName/g)].length
console.log({ hardLeft, resolveCount, titleLeft, delta: s.length - before.length })
if (titleLeft) {
  s.split(/\r?\n/).forEach((line, i) => {
    if (line.includes("titleClassName")) console.log(i + 1, line.trim())
  })
}
if (hardLeft) {
  s.split(/\r?\n/).forEach((line, i) => {
    if (line.includes('data-tier="composite"')) console.log(i + 1, line.trim())
  })
}

fs.writeFileSync(path, s)
