import React from "react"

interface NavbarProps extends React.ComponentPropsWithRef<"nav"> {
    children?: React.ReactNode
    isBordered?: boolean
    isMenuOpen?: boolean
    onMenuOpenChange?: (isOpen: boolean) => void
    maxWidth?: string
    className?: string
}

export const StarCiNavbar = ({ children, className, ...props }: NavbarProps) => {
    return <nav className={`flex items-center justify-between px-4 py-2 ${className ?? ""}`} {...props}>{children}</nav>
}

export const StarCiNavbarBrand = ({ children, className, ...props }: React.ComponentPropsWithRef<"div"> & { children?: React.ReactNode }) => (
    <div className={className} {...props}>{children}</div>
)

export const StarCiNavbarContent = ({ children, className, justify, ...props }: React.ComponentPropsWithRef<"div"> & { children?: React.ReactNode; justify?: "start" | "center" | "end" }) => (
    <div className={`flex items-center ${justify === "end" ? "ml-auto" : justify === "center" ? "mx-auto" : ""} ${className ?? ""}`} {...props}>{children}</div>
)

export const StarCiNavbarItem = ({ children, className, ...props }: React.ComponentPropsWithRef<"div"> & { children?: React.ReactNode }) => (
    <div className={className} {...props}>{children}</div>
)

interface NavbarMenuToggleProps extends React.ComponentPropsWithRef<"button"> {
    icon?: React.ReactNode
    srOnlyText?: string
}
export const StarCiNavbarMenuToggle = (props: NavbarMenuToggleProps) => <button {...props} />

export const StarCiNavbarMenu = ({ children, className, ...props }: React.ComponentPropsWithRef<"div"> & { children?: React.ReactNode }) => (
    <div className={className} {...props}>{children}</div>
)

export const StarCiNavbarMenuItem = ({ children, className, ...props }: React.ComponentPropsWithRef<"div"> & { children?: React.ReactNode }) => (
    <div className={className} {...props}>{children}</div>
)
