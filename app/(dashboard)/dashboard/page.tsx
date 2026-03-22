"use client"

import React, { useEffect, useState } from "react"
import { ButtonDemo, BreadcrumbDemo, TableSkeleton } from "@/components/index"
import { DataTableDemo } from "./data-table/DataTableDemo"
import { Payment, columns } from "./data-table/columns"
import { LOCAL_DATA } from "@/constants/index"
import { Card, CardContent } from "@/components/ui/card"
import { useUserStore } from "@/modules/users/store"

const {} = LOCAL_DATA.images

const breadcrumbItems = [
  {
    label: "Dashboard",
  },
]

const Page = () => {
  const [filteredData, setFilteredData] = useState<Payment[]>([])
  const isUsersLoading = useUserStore((s) => s.isUsersLoading)

  const users = useUserStore((s) => s.users)

  useEffect(() => {
    if (!users.length) return
    const _users: any = users

    const getData = (): Payment[] => {
      return _users
        .filter((item: any) => item.isDeleted !== true)
        .map((item: any) => {
          return {
            status: "active",
            ...item,
            name: item.name || "",
          }
        })
    }

    const data = getData()

    setFilteredData(data)
  }, [users])

  return (
    <main className="dashboard-page p-5">
      <h2 className="mb-3 text-2xl">Dashboard</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />

      <Card className="mb-37.5">
        <CardContent>
          {isUsersLoading ? (
            <TableSkeleton value="client loading (users)..." />
          ) : (
            <DataTableDemo data={filteredData} columns={columns} />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default Page
