"use client"

import React, { useState, useEffect } from "react"
import {
  InputDemo,
  ButtonDemo,
  UploadImageDemo,
  FormSkeleton,
} from "@/components/index"
import { Card, CardHeader } from "@/components/ui/card"
import { LOCAL_DATA } from "@/constants/index"
import { Section } from "@/modules/sections/types"
import { useSectionStore } from "@/modules/sections/store"
import {successAlert, errorAlert, warningAlert} from '@/lib/utils/alert'

const { placeholderImage } = LOCAL_DATA.images

const Template = () => {
  const [state, setState] = useState<Section>({
    status: "published",
    title: "",
    description: "",
    sectionName: "",
    images: [{ id: "1", title: "", url: placeholderImage }],
  })

  const [isSectionEmpty, setIsSectionEmpty] = useState(false)
  const getSectionAsync = useSectionStore((s) => s.getSectionAsync)
  const createSectionAsync = useSectionStore((s) => s.createSectionAsync)
  const updateSectionAsync = useSectionStore((s) => s.updateSectionAsync)
  const section = useSectionStore((s) => s.section)
  const isSectionLoading = useSectionStore((s) => s.isSectionLoading)
  const isSectionCreating = useSectionStore((s) => s.isSectionCreating)
  const isSectionUpdating = useSectionStore((s) => s.isSectionUpdating)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSectionEmpty) {
      createSectionAsync({
        sectionId: "hero",
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          status: state.status,
          sectionName: state.sectionName,
          title: state.title,
          description: state.description,
          images: state.images,
        },
      })
    } else {
      updateSectionAsync({
        sectionId: "hero",
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          ...(state.status !== section.status ? { status: state.status } : {}),
          ...(state.sectionName !== section.sectionName
            ? { sectionName: state.sectionName }
            : {}),
          ...(state.title !== section.title ? { title: state.title } : {}),
          ...(state.description !== section.description
            ? { description: state.description }
            : {}),
          images: state.images,
        },
      })
    }
  }

  useEffect(() => {
    getSectionAsync({ sectionId: "hero" })
  }, [])

  useEffect(() => {
    setIsSectionEmpty(!Object.keys(section).length)
    if (!Object.keys(section).length) return
    const { title = "", description = "", images } = section
    setState((prev) => ({
      ...prev,
      title,
      description,
      images,
    }))
  }, [section])

  return (
    <>
      {isSectionLoading ? (
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
                  label="Title"
                  name="title"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.title}
                  placeholder="Enter Title"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Description"
                  name="description"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.description}
                  placeholder="Enter Description"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                {state.images &&
                  state?.images?.map((item: { [key: string]: string }) => {
                    return (
                      <UploadImageDemo
                        key={item.id}
                        {...item}
                        state={state}
                        setState={setState}
                      />
                    )
                  })}

                {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
                <ButtonDemo
                  text={`${
                    isSectionCreating
                      ? "Creating..."
                      : isSectionUpdating
                        ? "Updating..."
                        : isSectionEmpty
                          ? "Create"
                          : "Update"
                  } `}
                  className={`w-full`}
                  disabled={isSectionCreating || isSectionUpdating}
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
