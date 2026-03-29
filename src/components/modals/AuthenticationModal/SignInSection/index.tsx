"use client"
import React, { useState } from "react"
import {
    StarCiModalBody,
    StarCiInput,
    StarCiDivider,
    StarCiButton,
    StarCiCheckbox,
    StarCiLink,
} from "../../../atomic"
import { Spacer } from "@heroui/react"
import { GoogleIcon } from "../../../svg"
import { useAppDispatch } from "@/redux"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import {
    AuthenticationModalTab,
    setAuthenticationModalTab,
} from "@/redux/slices"
import { useSignInFormik } from "@/hooks/singleton"
import { useKeycloak } from "@/hooks/singleton"

export const SignInSection = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { data: keycloak, isLoading: keycloakLoading } = useKeycloak()
    const dispatch = useAppDispatch()
    const {
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInFormik()

    return (
        <StarCiModalBody>
            <StarCiButton
                type="button"
                variant="bordered"
                className="w-full text-sm"
                isDisabled={keycloakLoading || !keycloak}
                startContent={<GoogleIcon className="w-5 h-5" />}
                onPress={
                    async () => {
                        await keycloak?.login({
                            idpHint: "google",
                        }
                        )
                    }
                }
            >
                    Sign In With Google
            </StarCiButton>
            <Spacer y={3} />
            <StarCiDivider />
            <Spacer y={3} />
            <StarCiInput
                isRequired
                type="email"
                label="Email"
                placeholder="Enter your email"
                name="email"
                value={values.email}
                onValueChange={(email) => setFieldValue("email", email)}
                onBlur={() => setFieldTouched("email", true)}
                isInvalid={!!(touched.email && errors.email)}
                errorMessage={touched.email ? errors.email : undefined}
            />
            <Spacer y={3} />
            <StarCiInput
                isRequired
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                name="password"
                value={values.password}
                onValueChange={(password) => setFieldValue("password", password)}
                onBlur={() => setFieldTouched("password", true)}
                isInvalid={!!(touched.password && errors.password)}
                errorMessage={touched.password ? errors.password : undefined}
                endContent={
                    <StarCiLink
                        as="button"
                        className="mr-1 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((s) => !s)}
                    >
                        {showPassword ? (
                            <EyeIcon className="h-4 w-4" />
                        ) : (
                            <EyeClosedIcon className="h-4 w-4" />
                        )}
                    </StarCiLink>
                }
            />
            <Spacer y={3} />
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                    <StarCiCheckbox
                        size="sm"
                        aria-label="Remember me"
                        isSelected={values.rememberMe}
                        onValueChange={(rememberMe) => setFieldValue("rememberMe", rememberMe)}
                    />
                    <div className="text-xs text-foreground-500">
                            Remember me
                    </div>
                </div>
                <StarCiLink className="text-xs">Forgot Password?</StarCiLink>
            </div>
            <Spacer y={3} />
            <StarCiButton
                type="submit"
                color="primary"
                fullWidth
                isLoading={isSubmitting}
            >
                    Sign In
            </StarCiButton>
            <Spacer y={3} />
            <div className="flex justify-center items-center gap-1">
                <div className="text-xs text-foreground-500">
                        Don&apos;t have an account?
                </div>
                <StarCiLink
                    className="text-xs"
                    onPress={() =>
                        dispatch(
                            setAuthenticationModalTab(
                                AuthenticationModalTab.SignUp
                            )
                        )
                    }
                >
                        Sign Up
                </StarCiLink>
            </div>
        </StarCiModalBody>
    )
}
