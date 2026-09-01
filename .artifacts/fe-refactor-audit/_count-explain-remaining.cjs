const fs = require("fs")
const path = require("path")
const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json","utf8"))
const LOCKED = [
    /MockInterviewPage\/MockInterviewSession\//,
    /FlashcardsPage\/QuizSession\//,
    /LandingPage\/LearnLoopScroll\//,
    /blocks\/learn\/ContentAiChat\//,
    /blocks\/marketing\/ArchitectureScene\//,
    /\.storybook\/utils\/BlockAnatomy\//,
    /\/nivoexpert\//,
    /\/nivo\//,
    /src\/resources\//,
]
const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        holdPaths.set(String(p).replace(/\\/g,"/").replace(/:\d+$/,""), d.id)
    }
}
function holdId(file) {
    const f = file.replace(/\\/g,"/")
    for (const [hp,id] of holdPaths) {
        if (f === hp || f.startsWith(hp + "/") || f.includes(hp)) return id
    }
    return null
}
function isLocked(file) { return LOCKED.some(re => re.test(file.replace(/\\/g,"/"))) }
function walk(d, out=[]) {
    for (const e of fs.readdirSync(d,{withFileTypes:true})) {
        const p = path.join(d,e.name).replace(/\\/g,"/")
        if (e.isDirectory()) {
            if (["node_modules",".git",".next"].includes(e.name)) continue
            walk(p,out)
        } else if (/\.tsx?$/.test(e.name)) out.push(p)
    }
    return out
}
function scanOpening(src, from) {
    let depth=0, inStr=null, end=-1, attr=""
    for (let j=from;j<src.length;j++) {
        const ch=src[j]
        if (inStr) { if (ch==="\\"){j++;continue} if (ch===inStr) inStr=null; if (depth===0) attr+=ch; continue }
        if (ch==="\""||ch==="'"||ch==="`") { inStr=ch; if (depth===0) attr+=ch; continue }
        if (ch==="{") { depth++; continue }
        if (ch==="}") { depth=Math.max(0,depth-1); continue }
        if (depth===0 && ch===">") { end=j; break }
        if (depth===0) attr+=ch
    }
    if (end<0) return null
    return { hasExplain: /(?<![\w-])explain\s*=/.test(attr) }
}
const PRINCIPLE_RE = /(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g
let unlockedMissing=0, lockedMissing=0, holdMissing=0, unlockedOk=0
const missingFiles=new Set()
for (const file of walk("src").concat(walk(".storybook"))) {
    const src = fs.readFileSync(file,"utf8")
    let m; const re=new RegExp(PRINCIPLE_RE.source,"g")
    while ((m=re.exec(src))) {
        const sc = scanOpening(src, m.index)
        if (!sc) continue
        if (sc.hasExplain) { if (!isLocked(file) && !holdId(file)) unlockedOk++; continue }
        if (isLocked(file)) lockedMissing++
        else if (holdId(file)) holdMissing++
        else { unlockedMissing++; missingFiles.add(file) }
    }
}
console.log(JSON.stringify({ unlockedMissing, lockedMissing, holdMissing, unlockedOk, missingFileCount: missingFiles.size, missingSample:[...missingFiles].slice(0,20) }, null, 2))