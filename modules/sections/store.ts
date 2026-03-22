import { create } from "zustand"
import type { SectionResponse } from "@/modules/sections/types"
import * as sectionsApi from "@/modules/sections/api"

const noop = () => {}

type SectionStore = {
  section: SectionResponse
  isSectionLoading: boolean
  isSectionCreating: boolean
  isSectionUpdating: boolean
  getSectionAsync: (params?: any) => Promise<void>
  createSectionAsync: (params?: any) => Promise<void>
  updateSectionAsync: (params?: any) => Promise<void>
}

export const useSectionStore = create<SectionStore>((set, get) => ({
  section: {},
  isSectionLoading: false,
  isSectionCreating: false,
  isSectionUpdating: false,

  getSectionAsync: async ({ sectionId = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isSectionLoading: true })

    try {
      const data = await sectionsApi.getSection({ id: sectionId })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =getSectionAsync=")

      set({ section: data.data })
      successCB(data.message)
    } finally {
      set({ isSectionLoading: false })
    }
  },

  createSectionAsync: async ({ sectionId = "", fields = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isSectionCreating: true })

    try {
      const data = await sectionsApi.createSection({
        id: sectionId,
        body: fields,
      })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =createSectionAsync=")

      await get().getSectionAsync({ sectionId })
      successCB(data.message || "Section has been created successfully.")
    } finally {
      set({ isSectionCreating: false })
    }
  },

  updateSectionAsync: async ({ sectionId = "", fields = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isSectionUpdating: true })

    try {
      const data = await sectionsApi.updateSection({
        id: sectionId,
        body: fields,
      })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =updateSectionAsync=")

      await get().getSectionAsync({ sectionId })
      successCB(data.message || "Section has been updated successfully.")
    } finally {
      set({ isSectionUpdating: false })
    }
  },
}))
