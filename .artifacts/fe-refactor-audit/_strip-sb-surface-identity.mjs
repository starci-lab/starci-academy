/**
 * Strip identity= from SB twins whose root composite does not accept identity yet
 * (SB SurfaceCard / SurfaceCardList lack the prop; src copies do).
 */
import fs from "node:fs"

const files = [
    ".storybook/components/starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard.tsx",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardHero/index.tsx",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardItem/index.tsx",
    ".storybook/components/starci/blocks/learn/KeepGoingPath/KeepGoingPath.tsx",
    ".storybook/components/starci/blocks/learn/ModuleChallengeList/ModuleChallengeList.tsx",
    ".storybook/components/starci/blocks/learn/ModuleLessonList/ModuleLessonList.tsx",
    ".storybook/components/starci/blocks/learn/PlaygroundEnterBanner/PlaygroundEnterBanner.tsx",
    ".storybook/components/starci/blocks/learn/MindMapRail/MindMapRail.tsx",
]

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log("missing", file)
        continue
    }
    let src = fs.readFileSync(file, "utf8")
    const before = src
    // multiline: identity line alone
    src = src.replace(/\r?\n(\s*)identity=\{\{ tier: "[^"]+", component: "[^"]+" \}\}/g, "")
    // same-line after tag name
    src = src.replace(/(\s)identity=\{\{ tier: "[^"]+", component: "[^"]+" \}\}/g, "")
    if (src === before) {
        console.log("no-change", file)
    } else {
        fs.writeFileSync(file, src)
        console.log("stripped", file)
    }
}
