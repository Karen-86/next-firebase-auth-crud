"use client"

import React, { useState, useEffect } from "react"
import { DialogDemo, ButtonDemo, InputDemo } from "@/components/index"
import { useBlogStore } from "@/modules/blogs/store"
import useAlert from "@/hooks/useAlert"

export default function DeleteBlogDialog({ blogId = "" }) {
  return (
    <DialogDemo
      contentClassName=""
      trigger={
        <ButtonDemo
          text={`${"Delete Blog"}`}
          className={`mt-2 w-full`}
          variant="outlineDanger"
        />
      }
    >
      {(closeDialog) => (
        <DeleteBlogDialogContent blogId={blogId} closeDialog={closeDialog} />
      )}
    </DialogDemo>
  )
}

const DeleteBlogDialogContent = ({ blogId = "", closeDialog = () => {} }) => {
  const deleteBlogAsync = useBlogStore((s) => s.deleteBlogAsync)
  const isBlogDeleting = useBlogStore((s) => s.isBlogDeleting)
  const { successAlert, errorAlert, warningAlert } = useAlert()

  const onDelete = (e: any) => {
    e.preventDefault()
    deleteBlogAsync({
      blogId,
      errorCB: (message: string) => errorAlert(message),
      successCB: (message: string) => successAlert(message),
    })
  }

  return (
    <div className="delete-blog-dialog">
      <h2 className="mb-5 text-2xl font-semibold!">Delete blog</h2>
      <p className="mb-6 text-sm leading-[1.6] text-gray-500">
        Are you sure you want to delete this blog?
      </p>

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog()
          }}
          disabled={isBlogDeleting}
        />

        <ButtonDemo
          variant="outlineDanger"
          text={`${isBlogDeleting ? "Deleting..." : "Delete"} `}
          onClick={onDelete}
          className={``}
          disabled={isBlogDeleting}
        />
      </div>
    </div>
  )
}
