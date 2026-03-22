"use client"

import React, { useState, useEffect } from "react"
import {
  ButtonDemo,
  DialogDemo,
  InputDemo,
  SelectDemo,
  // SelectScrollable
} from "@/components/index"
import useAlert from "@/hooks/useAlert"

import { DropdownMenuCheckboxes } from "@/components/index.js"
import { ChevronDown } from "lucide-react"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"
import { useUserStore } from "@/modules/users/store"
import { useAuthStore } from "@/modules/auth/store"

export const SetupUserDialog = ({ user = {} }) => {
  return (
    <DialogDemo contentClassName="" trigger={<div>{`${"Edit Settings"}`}</div>}>
      {(closeDialog) => <SetupUserDialogContent user={user} closeDialog={closeDialog} />}
    </DialogDemo>
  )
}

type StateProps = {
  roles: any
}

const SetupUserDialogContent = ({ user = {}, closeDialog = () => {} }: { user: any; closeDialog: () => void }) => {
  const updateTargetUserRolesAsync = useUserStore((s) => s.updateTargetUserRolesAsync)
  const getProfileAsync = useAuthStore((s) => s.getProfileAsync)
  const isTargetUserRolesUpdating = useUserStore(s=>s.isTargetUserRolesUpdating)

  const [state, setState] = useState<StateProps>({
    roles: user.roles,
  })

  const [defaultRoles, setDefaultRoles] = useState<any>([])

  const {successAlert, warningAlert } = useAlert()

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fields: { [key: string]: any } = {}

    if (state.roles !== user.roles) fields.roles = state.roles

    updateTargetUserRolesAsync({
      userId: user.id,
      fields,
      successCB: (message: string) => {
        closeDialog()
        successAlert(message)
        // getProfileAsync()
      },
      warningCB: (message: string) => {
        warningAlert(message)
      }
    })
  }

  const callback = (items: any) => {
    setState((prev) => ({
      ...prev,
      roles: items.filter((role: any) => role.isChecked).map((role: any) => role.name),
    }))
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      roles: user.roles,
    }))

    setDefaultRoles(
      [
        { id: "1", name: "user", isChecked: false },
        { id: "2", name: "admin", isChecked: false },
      ].map((role): any => ({
        id: role.id,
        name: role.name,
        isChecked: user.roles.includes(role.name),
      }))
    )
  }, [user])

  return (
    <div className="crop-avatar-dialog">
      <h2 className="mb-5 text-2xl font-semibold!">Change user settings</h2>
      <form onSubmit={onSubmit} className={`${""}`}>
        <DropdownMenuCheckboxes
          defaultItems={defaultRoles}
          callback={callback}
          triggerClassName={`w-full mb-10`}
          contentClassName={`w-full! mx-0 max-w-full!`}
          trigger={
            <ButtonDemo text="Assign Roles" className="justify-between" variant="outline" endIcon={<ChevronDown />} />
          }
          // side="right"
          // align="end"
        />

        {/* {currentUser?.uid !== user.id && (
          <SelectDemo
            label="Select"
            defaultItems={["user", "admin"].map((role) => {
              return {
                label: role,
                value: role,
                isSelected: state.role == role,
              };
            })}
            callback={({ value }) => {
              setState((prev) => ({
                ...prev,
                role: value.toString(),
              }));
            }}
            className="mb-5"
            contentClassName={`custom-content`}
          />
        )} */}

        {/* {currentUser?.uid !== user.id && (
          <SelectScrollable
            label="Role"
            triggerClassName="w-full mb-5"
            contentClassName=""
            defaultItems={["user", "admin"].map((type) => {
              return {
                label: type,
                value: type,
                isSelected: user.role == type,
              };
            })}
            callback={(selectedItem) => {
              setState((prev) => ({
                ...prev,
                role: selectedItem.value.toString(),
              }));
            }}
          />
        )} */}

        <div className="button-group flex justify-end gap-2">
          <ButtonDemo className="" disabled={isTargetUserRolesUpdating} text="Cancel" variant="outline" type="button" onClick={closeDialog} />
          <ButtonDemo className="" disabled={isTargetUserRolesUpdating} text={`${isTargetUserRolesUpdating ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  )
}
