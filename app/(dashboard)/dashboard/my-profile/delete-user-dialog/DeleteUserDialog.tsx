"use client"

import React, { useState, useEffect } from "react"
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index"
import { useUserStore } from "@/modules/users/store"
import useAlert from "@/hooks/useAlert"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"

export const DeleteUserDialog = ({ userId = "" }) => {
  return (
    <DialogDemo
      contentClassName=""
      trigger={<ButtonDemo text={`${"Delete Account"}`} className={`flex text-sm`} variant="outlineDanger" />}
    >
      {(closeDialog) => <DeleteUserDialogContent userId={userId} closeDialog={closeDialog} />}
    </DialogDemo>
  )
}

const DeleteUserDialogContent = ({ userId = "", closeDialog = () => {} }) => {
  const [confirmationText, setConfirmationText] = useState("")

  const deleteTargetUserAsync = useUserStore((s) => s.deleteTargetUserAsync)
  const isTargetUserDeleting = useUserStore((s) => s.isTargetUserDeleting)
  const { handleSignOut } = useAuthActions()

  const { successAlert, errorAlert } = useAlert()

  return (
    <div className="delete-user-dialog">
      <h2 className="mb-5 text-2xl font-semibold!">Delete account</h2>
      <p className="mb-6 text-sm leading-[1.6] text-gray-500">
        Are you sure you want to delete your account? This will permanently remove your account and all related data.{" "}
        <span className="text-red-400">This action cannot be undone.</span>
      </p>
      <span className="mb-1 block text-sm">Type "Delete account" below to continue.</span>
      <InputDemo
        // label={<span className="select-text">Type "Delete account" below to continue.</span>}
        placeholder="Delete account"
        name="password"
        type="text"
        callback={(e) => setConfirmationText(e.target.value)}
        className="mb-8"
        value={confirmationText}
      />

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog()
          }}
          disabled={isTargetUserDeleting}
        />

        <ButtonDemo
          className=""
          text={`${isTargetUserDeleting ? "Loading..." : "Delete Account"}`}
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
