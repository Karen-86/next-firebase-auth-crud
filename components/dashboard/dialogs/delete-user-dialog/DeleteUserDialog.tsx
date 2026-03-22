"use client"

import React, { useState, useEffect } from "react"
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index"
import { useUserStore } from "@/modules/users/store"
import useAlert from "@/hooks/useAlert"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"

const DeleteUserDialog = ({ userId = "" }) => {
  return (
    <DialogDemo
      contentClassName="pt-4 pb-6"
      trigger={<ButtonDemo text={`${"Delete Account"}`} className={``} size="xs" variant="ghostDanger" />}
    >
      {(closeDialog) => <DeleteUserDialogContent userId={userId} closeDialog={closeDialog} />}
    </DialogDemo>
  )
}

const DeleteUserDialogContent = ({ userId = "", closeDialog = () => {} }) => {
  const [confirmationText, setConfirmationText] = useState("")
  const { handleSignOut } = useAuthActions()

  const deleteTargetUserAsync = useUserStore((s) => s.deleteTargetUserAsync)
  const isTargetUserDeleting = useUserStore((s) => s.isTargetUserDeleting)

  const { successAlert, errorAlert } = useAlert()

  return (
    <div className="delete-user-dialog text-xs">
      <h2 className="mb-5 text-xs font-semibold!">Delete account</h2>
      <p className="mb-6 leading-[1.6] text-gray-500">
        Are you sure you want to delete your account? This will permanently remove your account and all related data.{" "}
        <span className="text-red-400">This action cannot be undone.</span>
      </p>
      <div className="mb-2 font-semibold">Type "Delete account" below to continue.</div>
      <InputDemo
        // label={<span className="select-text">Type "Delete account" below to continue.</span>}
        placeholder="Delete account"
        name="password"
        type="text"
        callback={(e) => setConfirmationText(e.target.value)}
        className="mb-5"
        inputClassName="!text-xs"
        value={confirmationText}
      />

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          size="xs"
          variant="ghost"
          type="button"
          onClick={() => {
            closeDialog()
          }}
          disabled={isTargetUserDeleting}
        />

        <ButtonDemo
          className=""
          text={`${isTargetUserDeleting ? "Loading..." : "Delete Account"}`}
          size="xs"
          variant="destructive"
          // disabled={!password || isTargetUserDeleting}
          disabled={confirmationText !== "Delete account" || isTargetUserDeleting}
          onClick={() => {
            if (userId)
              deleteTargetUserAsync({
                userId,
                errorCB: (message: string) => errorAlert(message),
                successCB: (message: string) => {
                  if (message === "Account deleted successfully") {
                    sessionStorage.setItem("signOutDetails", JSON.stringify([{ status: "success", message }]))
                   handleSignOut()
                  } else {
                    successAlert(message)
                    closeDialog()
                  }
                },
              })
          }}
        />
      </div>
    </div>
  )
}

export default DeleteUserDialog
