import createError from "@/lib/utils/createError"
import { db } from "@/lib/firebase/config/firebaseAdmin"

type Props = {
  id: string
  documentName: string
  collectionName: string
  ignoreNotFound?: boolean
}

const loadResource = async ({
  id = "id",
  documentName = "resource",
  collectionName = "",
  ignoreNotFound = false,
}: Props) => {
  if (!id) throw createError("Invalid ID", 400)

  const resourceRef = db.collection(collectionName).doc(id)
  const resourceSnap = await resourceRef.get()

  if (!resourceSnap.exists && !ignoreNotFound)
    throw createError(`${documentName} not found`, 404)

  const resourceData = { id: resourceSnap.id, ...resourceSnap.data() }

  const req: any = resourceSnap.exists
    ? {
        resourceRef,
        resourceSnap,
        resourceData,
      }
    : {}

  return req
}

export default loadResource
