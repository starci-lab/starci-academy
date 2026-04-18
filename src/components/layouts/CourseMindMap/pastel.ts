export type MindMapThemeMode = "light" | "dark"

/**
 * Soft pastel fill per module index; dark mode uses lower lightness for contrast on dark canvas.
 */
export function pastelBackgroundForIndex(
    index: number,
    theme: MindMapThemeMode = "light",
): string {
    const hue = (index * 47 + 18) % 360
    if (theme === "dark") {
        return `hsl(${hue} 28% 22%)`
    }
    return `hsl(${hue} 48% 93%)`
}
