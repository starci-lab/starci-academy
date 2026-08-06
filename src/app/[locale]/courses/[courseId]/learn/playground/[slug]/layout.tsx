import React from "react"
import { PlaygroundSessionProvider } from "@/components/providers/PlaygroundSessionProvider"
/** Props for Layout. */
interface LayoutProps { children: React.ReactNode }


/**
 * Shared shell for ONE playground exercise. Mounts
 * {@link PlaygroundSessionProvider} so the socket + session (and the pairing
 * code the learner already ran `npx` with) survive navigation between the two
 * child routes — Setup (`[slug]`) and Session (`[slug]/session`).
 *
 * Without this layout each route would own its own socket: pressing "Start
 * lab" would unmount the connection, mint a NEW pairing code, and force the
 * learner to re-run the agent command.
 */
const Layout = ({ children }: LayoutProps) => (
    <PlaygroundSessionProvider>
        {children}
    </PlaygroundSessionProvider>
)

export default Layout
