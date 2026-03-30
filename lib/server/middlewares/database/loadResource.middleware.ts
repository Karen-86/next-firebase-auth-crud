import createError from "@/lib/utils/createError"
import { db } from "@/lib/firebase/config/firebaseAdmin"

type Props = {
  id: string
  reqKey: string
  collectionName: string
  ignoreNotFound?: boolean
}

const loadResource = async ({
  id = "id",
  reqKey = "resource",
  collectionName = "",
  ignoreNotFound = false,
}: Props) => {
  if (!id) throw createError("Invalid ID", 400)

  const resourceRef = db.collection(collectionName).doc(id)
  const resourceSnap = await resourceRef.get()

  if (!resourceSnap.exists) {
    if (ignoreNotFound) return true
    throw createError(`${reqKey} not found`, 404)
  }

  const resourceData = { id: resourceSnap.id, ...resourceSnap.data() }

  const req: any = {}

  req[reqKey] = resourceData
  req[reqKey + "Ref"] = resourceRef
  req[reqKey + "Snap"] = resourceSnap

  return req
}

export default loadResource
