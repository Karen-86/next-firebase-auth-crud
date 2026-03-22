"use client"

import React, { useEffect, useState } from "react"
import { ButtonDemo, InputDemo, BreadcrumbDemo, DialogDemo, DeleteUserDialog } from "@/components/index"
import useJoiValidation from "@/hooks/useJoiValidation"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"
import { useAuthStore } from "@/modules/auth/store"
import useAlert from "@/hooks/useAlert"

// ADD PASSWORD
type ValidationResult = {
  error?: {
    details: {
      path: string[]
      message: string
    }[]
  }
}

const AddPasswordDialog = () => {
  return (
    <DialogDemo
      contentClassName="pt-4 pb-6"
      trigger={<ButtonDemo size="xs" text="Add Password" variant="ghost" className={``} />}
    >
      {(closeDialog) => <AddPasswordContent closeDialog={closeDialog} />}
    </DialogDemo>
  )
}
const AddPasswordContent = ({ closeDialog = () => {} }) => {
  const [state, setState] = useState({ password: "", repeatPassword: "" })
  const [isLoading, setIsLoading] = useState(false)

  const { handleLinkEmailPasswordAccount, handleSignOut } = useAuthActions()

  const authUser = useAuthStore((s) => s.authUser)

  const { validateAddPassword } = useJoiValidation()
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [result, setResult] = useState<ValidationResult>({})
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})

  const { successAlert } = useAlert()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = validateAddPassword(state)
    if (!error) {
      if (!authUser || !authUser.email) return
      handleLinkEmailPasswordAccount({
        email: authUser.email,
        password: state.password,
        setIsLoading,
        successCB: () => {
          sessionStorage.setItem(
            "signOutDetails",
            JSON.stringify([
              { status: "success", message: "Verification email sent! Please check your inbox." },
              { status: "success", message: "Successfully linked email/password account! Please sign in again." },
            ])
          )
          handleSignOut()
        },
      })
      console.log("Submit")
    }
    if (!error) return
    setWasSubmitted(true)
  }

  useEffect(() => setResult(validateAddPassword(state)), [state])

  useEffect(() => {
    if (!wasSubmitted) return
    const errors: Record<string, string> = {}
    result?.error?.details.forEach((item) => {
      if (errors[item.path[0]]) return
      errors[item.path[0]] = item.message
    })
    setErrorMessages(errors)
  }, [result, wasSubmitted])

  return (
    <form onSubmit={onSubmit} className={`${wasSubmitted ? "was-submitted" : ""} text-xs`}>
      <h2 className="mb-5 text-xs !font-semibold">Add password</h2>
      <p className="mb-6 leading-[1.6] text-gray-500">
        Secure your account with a password. This allows you to sign in using your email and password, even if you
        normally use Google or another method.
      </p>
      <InputDemo
        label={<span className="text-xs font-semibold">Password</span>}
        placeholder="Password"
        name="password"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-5"
        value={state.password}
        errorMessage={errorMessages.password}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />

      <InputDemo
        label={<span className="text-xs font-semibold">Repeat Password</span>}
        placeholder="Repeat Password"
        name="repeatPassword"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-5"
        value={state.repeatPassword}
        errorMessage={errorMessages.repeatPassword}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo text={`${isLoading ? "Loading..." : "Add Password"}`} disabled={isLoading} />
      </div>
    </form>
  )
}

export default AddPasswordDialog
