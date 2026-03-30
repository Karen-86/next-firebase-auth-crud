"use client"

import React, { useState, useEffect } from "react"
import {
  InputDemo,
  ButtonDemo,
  UploadImageDemo,
  FormSkeleton,
} from "@/components/index"
import { Card, CardHeader } from "@/components/ui/card"
import { Page } from "@/modules/pages/types"
import { usePageStore } from "@/modules/pages/store"
import {successAlert, errorAlert, warningAlert} from '@/lib/utils/alert'

const Template = () => {
  const [state, setState] = useState<Page>({
    status: "published",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  })

  const [isPageEmpty, setIsSectionEmpty] = useState(false)

  const getPageAsync = usePageStore((s) => s.getPageAsync)
  const createPageAsync = usePageStore((s) => s.createPageAsync)
  const updatePageAsync = usePageStore((s) => s.updatePageAsync)
  const page = usePageStore((s) => s.page)
  const isPageLoading = usePageStore((s) => s.isPageLoading)
  const isPageCreating = usePageStore((s) => s.isPageCreating)
  const isPageUpdating = usePageStore((s) => s.isPageUpdating)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isPageEmpty) {
      createPageAsync({
        pageId: "home",
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          status: state.status,
          slug: state.slug,
          metadata: {
            metaTitle: state.metaTitle,
            metaDescription: state.metaDescription,
          },
        },
      })
    } else {
      updatePageAsync({
        pageId: "home",
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          ...(state.status !== page.status ? { status: state.status } : {}),
          ...(state.slug !== page.slug ? { slug: state.slug } : {}),
          metadata: {
            ...(state.metaTitle !== page.metaTitle
              ? { metaTitle: state.metaTitle }
              : {}),
            ...(state.metaDescription !== page.metaDescription
              ? { metaDescription: state.metaDescription }
              : {}),
          },
        },
      })
    }
  }

  useEffect(() => {
    getPageAsync({ pageId: "home" })
  }, [])

  useEffect(() => {
    setIsSectionEmpty(!Object.keys(page).length)
    if (!Object.keys(page).length) return
    const { slug = "", metadata = {} } = page
    setState((prev) => ({
      ...prev,
      slug,
      metaTitle: metadata.metaTitle,
      metaDescription: metadata.metaDescription,
    }))
  }, [page])

  return (
    <>
      {isPageLoading ? (
        <Card>
          <CardHeader>
            <FormSkeleton />
          </CardHeader>
        </Card>
      ) : (
        <div className="mb-[150px]">
          <Card>
            <CardHeader>
              <form action="" onSubmit={onSubmit}>
                <InputDemo
                  label="Slug"
                  name="slug"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.slug}
                  placeholder="Enter the page slug"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Meta Title"
                  name="metaTitle"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.metaTitle}
                  placeholder="Shown in search engines and browser tabs (50–60 chars)"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Meta Description"
                  name="metaDescription"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.metaDescription}
                  placeholder="Meta description for SEO and social previews (140–160 chars)"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />

                <ButtonDemo
                  text={`${
                    isPageCreating
                      ? "Creating..."
                      : isPageUpdating
                        ? "Updating..."
                        : isPageEmpty
                          ? "Create"
                          : "Update"
                  } `}
                  className={`w-full`}
                  disabled={isPageCreating || isPageUpdating}
                />
              </form>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  )
}

export default Template
