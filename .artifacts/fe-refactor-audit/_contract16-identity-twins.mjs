import fs from "node:fs"

function patchWeekly(path) {
  let s = fs.readFileSync(path, "utf8")
  const before = s
  s = s.replaceAll(
    'StackV identity={{ tier: "block", component: "WeeklyGoals" }} gap={3}',
    "StackV gap={3}",
  )
  s = s.replaceAll(
    'StackV identity={{ tier: "block", component: "WeeklyGoals" }} gap={4}',
    "StackV gap={4}",
  )
  if (!s.includes('identity={{ tier: "block", component: "WeeklyGoals" }}')) {
    s = s.replace(
      /<SurfaceCard(\r?\n)\s*label="Weekly Goals"/,
      '<SurfaceCard$1        identity={{ tier: "block", component: "WeeklyGoals" }}$1        label="Weekly Goals"',
    )
  }
  fs.writeFileSync(path, s)
  console.log(path, s.length - before.length, (s.match(/identity=\{\{ tier: "block", component: "WeeklyGoals"/g) || []).length)
}

function patchJob(path) {
  let s = fs.readFileSync(path, "utf8")
  const before = s
  s = s.replace(
    'return <StackV identity={{ tier: "block", component: "JobReadinessWidget" }} gap={4} isSkeleton={isSkeleton} items={[() => trackSummary]} />',
    "return <StackV gap={4} isSkeleton={isSkeleton} items={[() => trackSummary]} />",
  )
  if (!s.includes('identity={{ tier: "block", component: "JobReadinessWidget" }}')) {
    s = s.replace(
      /<SurfaceCard(\r?\n)\s*label="My readiness"/,
      '<SurfaceCard$1        identity={{ tier: "block", component: "JobReadinessWidget" }}$1        label="My readiness"',
    )
  }
  fs.writeFileSync(path, s)
  console.log(path, s.length - before.length, (s.match(/identity=\{\{ tier: "block", component: "JobReadinessWidget"/g) || []).length)
}

patchWeekly(".storybook/components/starci/blocks/dashboard/WeeklyGoals/WeeklyGoals.tsx")
patchJob(".storybook/components/starci/blocks/dashboard/JobReadinessWidget/JobReadinessWidget.tsx")
