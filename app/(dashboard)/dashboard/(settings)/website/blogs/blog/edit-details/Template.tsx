"use client"

import React, { useState, useEffect } from "react"
import {
  InputDemo,
  ButtonDemo,
  AccordionDemo,
  RichTextEditorDemo,
  UploadImageDemo,
  BlogFormSkeleton,
} from "@/components/index"
import { PlusIcon } from "lucide-react"
import { LOCAL_DATA } from "@/constants/index"
import { v4 as uuidv4 } from "uuid"
import DeleteBlogDialog from "./delete-blog-dialog/DeleteBlogDialog"
import { initialValue } from "@/components/rich-text-editor/RichTextEditorDemo"
import { Blog } from "@/modules/blogs/types"
import { useBlogStore } from "@/modules/blogs/store"
import {successAlert, errorAlert, warningAlert} from '@/lib/utils/alert'
import { useAuthStore } from "@/modules/auth/store"

const { placeholderImage } = LOCAL_DATA.images

const Template = () => {
  const blogs = useBlogStore((s) => s.blogs)
  const isBlogsLoading = useBlogStore((s) => s.isBlogsLoading)
  const getBlogsAsync = useBlogStore((s) => s.getBlogsAsync)


  const user = useAuthStore(s=>s.user)

  const [filteredBlogs, setFilteredBlogs] = useState<{ [key: string]: any }[]>(
    []
  )

  useEffect(() => {
    getBlogsAsync()
  }, [])

  useEffect(() => {
    setFilteredBlogs(blogs)
  }, [blogs])

  const populateList = () => {
    setFilteredBlogs((prev): any => {
      return [
        ...prev,
        {
          id: uuidv4(),
          author: user.email,
          slug: `${uuidv4()}`,
          title: "",
          description: "",
          images: [{ id: "1", title: "", url: placeholderImage }],
          isFeatured: true,
          isNewBlog: true,
        },
      ]
    })
  }

  return (
    <>
      {isBlogsLoading ? (
        <BlogFormSkeleton />
      ) : (
        <div className="blog-list mb-[150px]">
          {filteredBlogs.length ? (
            <AccordionDemo
              // type="multiple"
              className=""
              itemClassName={`!border rounded-md mb-[0.5rem] overflow-hidden`}
              triggerClassName="!rounded-none text-[14px] font-normal !no-underline p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-md"
              items={filteredBlogs.map((blogItem: any, index: any) => {
                return {
                  itemClassName: blogItem.slug,
                  trigger: (
                    <div className="flex w-full items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Author:</span>
                        <span className="text-xs text-gray-500">
                          {blogItem.author}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-dark min-w-[150px] truncate">
                          {" "}
                          {blogItem.title}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {blogItem.slug}
                      </div>{" "}
                    </div>
                  ),
                  content: (
                    <BlogItem key={index} {...{ blogItem, filteredBlogs }} />
                  ),
                }
              })}
            />
          ) : (
            <h2 className="mb-4 text-3xl text-gray-300">Empty</h2>
          )}

          {filteredBlogs.length === blogs.length && (
            <ButtonDemo
              disabled={isBlogsLoading}
              onClick={populateList}
              icon={<PlusIcon />}
              className="min-h-14 w-full"
              variant="secondary"
              text="Create New Blog"
            />
          )}
        </div>
      )}
    </>
  )
}

const BlogItem = ({ blogItem = {}, filteredBlogs = [] }: any) => {
  const [state, setState] = useState<Blog>({
    status: "draft",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    title: "",
    shortDescription: "",
    description: "",
    content: "",
    editorState: null,
    images: [],
  })

  const isBlogCreating = useBlogStore((s) => s.isBlogCreating)
  const isBlogUpdating = useBlogStore((s) => s.isBlogUpdating)
  const createBlogAsync = useBlogStore((s) => s.createBlogAsync)
  const updateBlogAsync = useBlogStore((s) => s.updateBlogAsync)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const slug = state.slug?.split(" ").join("-")

    if (blogItem.isNewBlog) {
      createBlogAsync({
        blogId: slug,
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          status: state.status,
          slug: slug,
          metaTitle: state.metaTitle,
          metaDescription: state.metaDescription,
          title: state.title,
          shortDescription: state.shortDescription,
          description: state.description,
          content: state.content,
          editorState: JSON.stringify(state.editorState),
          images: state.images,
        },
      })
      return
    } else {
      updateBlogAsync({
        blogId: slug,
        errorCB: (message: string) => errorAlert(message),
        successCB: (message: string) => successAlert(message),
        fields: {
          ...(state.status !== blogItem.status ? { status: state.status } : {}),
          ...(slug !== blogItem.slug ? { slug: slug } : {}),
          ...(state.metaTitle !== blogItem.metaTitle
            ? { metaTitle: state.metaTitle }
            : {}),
          ...(state.metaDescription !== blogItem.metaDescription
            ? { metaDescription: state.metaDescription }
            : {}),
          ...(state.title !== blogItem.title ? { title: state.title } : {}),
          ...(state.shortDescription !== blogItem.shortDescription
            ? { shortDescription: state.shortDescription }
            : {}),
          ...(state.description !== blogItem.description
            ? { description: state.description }
            : {}),
          ...(state.content !== blogItem.content
            ? { content: state.content }
            : {}),
          ...(state.editorState !== blogItem.editorState
            ? { editorState: JSON.stringify(state.editorState) }
            : {}),
          images: state.images,
        },
      })
    }
  }

  useEffect(() => {
    // if blog-page document dont exist in firebase the input values may go from defined to undefined throwing error, so just add here "if(!Object.values(blogItem).length) return"
    const tempState = {
      ...blogItem,
      editorState:
        (blogItem.editorState && JSON.parse(blogItem.editorState)) ||
        initialValue,
    }
    setState((prev) => ({ ...prev, ...tempState }))
  }, [blogItem])

  return (
    <div className="p-4">
      <form action="" onSubmit={onSubmit} className="">
        <InputDemo
          label="Slug"
          name="slug"
          type="text"
          callback={(e) => onChange(e)}
          className={`cursor-not-allowed ${!blogItem.isNewBlog ? "cursor-not-allowed" : ""} mb-5`}
          value={state.slug}
          disabled={!blogItem.isNewBlog}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Meta Title"
          name="metaTitle"
          placeholder="Shown in search engines and browser tabs (50–60 chars)"
          type="text"
          callback={(e) => onChange(e)}
          className={`mb-5`}
          value={state.metaTitle}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Meta Description"
          name="metaDescription"
          placeholder="Meta description for SEO and social previews (140–160 chars)"
          type="text"
          callback={(e) => onChange(e)}
          className={`mb-5`}
          value={state.metaDescription}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Title"
          name="title"
          placeholder="Enter the blog title"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.title}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Short Description"
          name="shortDescription"
          placeholder="A brief summary (1–2 sentences)"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.shortDescription}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Description"
          name="description"
          placeholder="Detailed description or excerpt"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.description}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        {state.images &&
          state.images.map((item: { [key: string]: string }) => {
            return (
              <UploadImageDemo
                key={item.id}
                {...item}
                state={state}
                setState={setState}
              />
            )
          })}

        {state.editorState && (
          <RichTextEditorDemo
            state={state}
            setState={setState}
            className="mb-5"
            label="Content"
          />
        )}

        {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
        <ButtonDemo
          text={`${isBlogCreating ? "Creating..." : isBlogUpdating ? "Updating..." : blogItem.isNewBlog ? "Create" : "Update"} `}
          className={`w-full`}
          disabled={
            (filteredBlogs.some(
              (item: any) => item.slug == state.slug?.split(" ").join("-").trim()
            ) &&
              state.slug?.split(" ").join("-").trim() !== blogItem.slug) ||
            !state.slug ||
            isBlogCreating ||
            isBlogUpdating
          }
        />
      </form>

      {!blogItem.isNewBlog && <DeleteBlogDialog blogId={state.slug} />}
    </div>
  )
}

export default Template
