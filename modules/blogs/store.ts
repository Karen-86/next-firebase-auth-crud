import { create } from "zustand"
import type { BlogResponse } from "@/modules/blogs/types"
import * as blogsApi from "@/modules/blogs/api"

const noop = () => {}

type BlogStore = {
  blogs: BlogResponse[]
  blog: BlogResponse | null
  isBlogsLoading: boolean
  isBlogLoading: boolean
  isBlogCreating: boolean
  isBlogUpdating: boolean
  isBlogDeleting: boolean
  getBlogsAsync: (params?: any) => Promise<void>
  getBlogAsync: (params?: any) => Promise<void>
  createBlogAsync: (params?: any) => Promise<void>
  updateBlogAsync: (params?: any) => Promise<void>
  deleteBlogAsync: (params?: any) => Promise<void>
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  blog: null,
  isBlogsLoading: false,
  isBlogLoading: false,
  isBlogCreating: false,
  isBlogUpdating: false,
  isBlogDeleting: false,

  getBlogsAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isBlogsLoading: true })

    try {
      const data = await blogsApi.getBlogs()

      if (!data.success) return errorCB(data.message)
      console.log(data, " =getblogsAsync=")

      set({ blogs: data.data })
      successCB(data.message)
    } finally {
      set({ isBlogsLoading: false })
    }
  },

  getBlogAsync: async ({ blogId = "", successCB = noop, errorCB = noop }) => {
    set({ isBlogLoading: true })

    try {
      const data = await blogsApi.getBlog({ id: blogId })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =getBlogAsync=")

      set({ blog: data.data })
      successCB(data.message)
    } finally {
      set({ isBlogLoading: false })
    }
  },

  createBlogAsync: async ({ blogId = "", fields = {}, successCB = noop, errorCB = noop }) => {
    set({ isBlogCreating: true })

    try {
      const data = await blogsApi.createBlog({ id: blogId, body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =createBlogAsync=")

      await get().getBlogsAsync()
      successCB(data.message || "Blog has been created successfully.")
    } finally {
      set({ isBlogCreating: false })
    }
  },

  updateBlogAsync: async ({ blogId = "", fields = {}, successCB = noop, errorCB = noop }) => {
    set({ isBlogUpdating: true })

    try {
      const data = await blogsApi.updateBlog({ id: blogId, body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =updateBlogAsync=")

      await get().getBlogsAsync()
      successCB(data.message || "Blog has been updated successfully.")
    } finally {
      set({ isBlogUpdating: false })
    }
  },

  deleteBlogAsync: async ({ blogId = "", successCB = noop, errorCB = noop }) => {
    set({ isBlogDeleting: true })

    try {
      const data = await blogsApi.deleteBlog({ id: blogId })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =deleteBlogAsync=")

      await get().getBlogsAsync()
      successCB(data.message || "Blog has been deleted successfully.")
    } finally {
      set({ isBlogDeleting: false })
    }
  },
}))
