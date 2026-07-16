export const SampleBody = () => (
    // p-0: the Card this sits inside already bakes p-3 (card.md — root `.card`
    // insets every child) — a padding class here would double-pad.
    <div className="flex flex-col gap-2 p-0">
        <p className="text-sm text-foreground">
            Fullstack Mastery course — Module 3: Advanced React
        </p>
        <p className="text-sm text-muted">
            68% progress · 12/18 lessons completed
        </p>
    </div>
)
