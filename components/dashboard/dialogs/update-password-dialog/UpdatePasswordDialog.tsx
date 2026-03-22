"use client"

import React, { useEffect, useState } from "react"
import { ButtonDemo, InputDemo, DialogDemo } from "@/components/index"
import useJoiValidation from "@/hooks/useJoiValidation"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"
import useAlert from "@/hooks/useAlert"

type ValidationResult = {
  error?: {
    details: {
      path: string[]
      message: string
    }[]
  }
}

// UPDATE PASSWORD
const UpdatePasswordDialog = () => {
  return (
    <DialogDemo
      contentClassName="pt-4 pb-6"
      trigger={<ButtonDemo size="xs" text="Update Password" variant="ghost" className={``} />}
    >
      {(closeDialog) => <UpdatePasswordContent closeDialog={closeDialog} />}
    </DialogDemo>
  )
}

const UpdatePasswordContent = ({ closeDialog = () => {} }) => {
  const [state, setState] = useState({ oldPassword: "", password: "", repeatPassword: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { handleSignOut, handleUpdatePassword } = useAuthActions()

  const { validateUpdatePassword } = useJoiValidation()
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
    const { error } = validateUpdatePassword(state)
    if (!error) {
      handleUpdatePassword({
        oldPassword: state.oldPassword,
        password: state.password,
        setIsLoading,
        successCB: () => {
          sessionStorage.setItem(
            "signOutDetails",
            JSON.stringify([
              { status: "success", message: "Your password has been updated successfully! Please sign in again." },
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

  useEffect(() => setResult(validateUpdatePassword(state)), [state])

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
      <h2 className="mb-5 text-xs !font-semibold">Update password</h2>
      <p className="mb-6 leading-[1.6] text-gray-500">
        To change your password, please enter your current password first, then choose a new one. Make sure your new
        password is strong and different from the old one.
      </p>
      <InputDemo
        label={<span className="text-xs font-semibold">Old Password</span>}
        placeholder="Old Password"
        name="oldPassword"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-3"
        value={state.oldPassword}
        errorMessage={errorMessages.oldPassword}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />
      <InputDemo
        label={<span className="text-xs font-semibold">New Password</span>}
        placeholder="New Password"
        name="password"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-3"
        value={state.password}
        errorMessage={errorMessages.password}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />

      <InputDemo
        label={<span className="text-xs font-semibold"> Repeat New Password</span>}
        placeholder="Repeat New Password"
        name="repeatPassword"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-5"
        value={state.repeatPassword}
        errorMessage={errorMessages.repeatPassword}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo text={`${isLoading ? "Loading..." : "Update Password"}`} size="xs" disabled={isLoading} />
      </div>
    </form>
  )
}

export default UpdatePasswordDialog
