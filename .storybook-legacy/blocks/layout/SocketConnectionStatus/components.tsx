import { useEffect } from "react"
import { ToastProvider } from "@heroui/react"
import { SocketConnectionStatus } from "@/components/blocks/layout/SocketConnectionStatus"
import { useSocketConnectionStore } from "@/hooks/socketio/connectionStore"

/**
 * Drives the real connection store through a timeline so the toast's debounced
 * phases (hidden → down → recovered → hidden) show up exactly as they would in
 * the app, without faking the component's own state.
 */
export const SocketScenario = ({ scenario }: { scenario: "stable" | "drop" | "recover" }) => {
    useEffect(() => {
        const { setStatus } = useSocketConnectionStore.getState()
        const timers: Array<ReturnType<typeof setTimeout>> = []

        if (scenario === "drop") {
            setStatus("job_notifications", "disconnected")
        } else if (scenario === "recover") {
            setStatus("job_notifications", "disconnected")
            timers.push(
                setTimeout(() => setStatus("job_notifications", "connected"), 2200),
            )
        }

        return () => {
            timers.forEach(clearTimeout)
            setStatus("job_notifications", "connected")
        }
    }, [scenario])

    return (
        <>
            <ToastProvider />
            <SocketConnectionStatus />
        </>
    )
}
