import { useAuthStore } from "@/modules/auth/store"
import { useUserStore } from "@/modules/users/store"
import useAlert from "@/hooks/useAlert"

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  verifyBeforeUpdateEmail,
  signOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth"
import { collection, doc, setDoc, addDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/config/firebaseClient"
import { User } from "firebase/auth"
import * as authApi from "@/modules/auth/api"
import { resetAllStores } from "@/store/utils/resetAllStores"

const noop = () => {}

export const useAuthActions = () => {
  const setIsAuthUserLoading = useAuthStore((s) => s.setIsAuthUserLoading)
  const setIsUserLoading = useAuthStore((s) => s.setIsUserLoading)
  const authUser = useAuthStore((s) => s.authUser)
  const getProfileAsync = useAuthStore((s) => s.getProfileAsync)
  const setAuthUser = useAuthStore((s) => s.setAuthUser)
  const getUsersAsync = useUserStore((s) => s.getUsersAsync)

  const { errorAlert, successAlert, warningAlert } = useAlert()

  const handleSignUp = async ({ name = "", email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true)
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(res.user, {
        displayName: name,
      })

      handleEmailVerification({ user: res.user })

      // create user in DB
      const fields = { displayName: res.user.displayName }
      const data = await authApi.createUser({ body: fields })
      if (!data.success) return errorAlert(data.message)
      getProfileAsync()
      getUsersAsync()

      successAlert("You’ve signed up successfully!")
    } catch (err: any) {
      if (err.message == "Firebase: Error (auth/email-already-in-use).") {
        errorAlert("Email already in use. Please use a different email or log in.")
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.")
      }
      console.error(err, "=handleSignUp= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async ({ email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true)

    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      const userRef = doc(db, "users", res.user.uid)
      const userSnap = await getDoc(userRef)

      // If user doesn't exist in DB, create user in DB
      if (!userSnap.exists()) {
        const fields = { displayName: res.user.displayName }
        const data = await authApi.createUser({ body: fields })
        if (!data.success) return errorAlert(data.message)
        getProfileAsync()
        getUsersAsync()
        successAlert("User created.")
      }

      // if email updated in auth, update email in DB
      if (userSnap.exists() && userSnap.data().email !== res.user.email) {
        await authApi.updateUserEmail()
        getProfileAsync()
        getUsersAsync()
      }

      successAlert("You’ve signed in successfully!")
      if (!res.user.emailVerified) warningAlert("This email isn’t verified. Please check your inbox to verify it.")
    } catch (err: any) {
      err.message === "Firebase: Error (auth/invalid-credential)."
        ? errorAlert("Invalid email or password.")
        : errorAlert(err.message || "Internal server error. Please try again later.")

      console.error(err, "=handleSignIn= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithGoogle = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)

      setAuthUser(res.user)

      const userRef = doc(db, "users", res.user.uid)
      const userSnap = await getDoc(userRef)

      // If user doesn't exist in DB, create user in DB
      if (!userSnap.exists()) {
        const fields = { displayName: res.user.displayName, photoURL: res.user.photoURL }
        const data = await authApi.createUser({ body: fields })
        if (!data.success) return errorAlert(data.message)
        getProfileAsync()
        getUsersAsync()
      }

      // if email updated in auth, update email in DB
      if (userSnap.exists() && userSnap.data().email !== res.user.email) {
        await authApi.updateUserEmail()
        getProfileAsync()
        getUsersAsync()
      }

      successAlert("You’ve signed in successfully!")
      if (!res.user.emailVerified) warningAlert("This email isn’t verified. Please check your inbox to verify it.")
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup before completing sign-in.")
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.")
      }
      console.error(err, "=handleSignInWithGoogle= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async ({ successCB = noop, setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true)
    try {
      await signOut(auth)
      // successAlert("You’ve signed out successfully!")
      // router.push("/sign-in");
      // resetAllStores()

      let details = []
      const stored = sessionStorage.getItem("signOutDetails")
      if (stored) details = JSON.parse(stored)
      details.push({ status: "success", message: "You’ve signed out successfully!" })
      sessionStorage.setItem("signOutDetails", JSON.stringify(details))

      window.location.href = "/sign-in"
      successCB()
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleSignOut= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async ({
    user,
    setIsLoading = () => {},
    ignoreAlert = false,
  }: {
    user: User
    setIsLoading?: (_: boolean) => void
    ignoreAlert?: boolean
  }) => {
    setIsLoading(true)
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
      })
      if (!ignoreAlert) successAlert("Verification email sent! Please check your inbox.")
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleEmailVerification= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkEmailPasswordAccount = async ({
    email = "",
    password = "",
    setIsLoading = (_: boolean) => {},
    successCB = () => {},
  }) => {
    if (!authUser) return
    setIsLoading(true)
    const credential = EmailAuthProvider.credential(email, password)
    try {
      await linkWithCredential(authUser, credential)
      await handleEmailVerification({ user: authUser, ignoreAlert: true })
      // successAlert("Successfully linked email/password account!")
      successCB()
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleLinkEmailPasswordAccount= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async ({ email = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      successAlert("Password reset link sent! Check your email.")
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleResetPassword= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async ({
    oldPassword = "",
    password = "",
    setIsLoading = (_: boolean) => {},
    successCB = () => {},
  }) => {
    if (!authUser || !authUser.email) return
    setIsLoading(true)
    try {
      const credential = EmailAuthProvider.credential(authUser.email, oldPassword)
      await reauthenticateWithCredential(authUser, credential)
      await updatePassword(authUser, password)
      successCB()
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleUpdatePassword= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEmail = async ({ email = "", setIsLoading = (_: boolean) => {}, successCB = () => {} }) => {
    if (!authUser) return
    setIsLoading(true)
    try {
      await verifyBeforeUpdateEmail(authUser, email)
      // await updateEmail(currentUser, email);
      // handleEmailVerification({ user: res.user });
      // successAlert("Your email has been updated successfully!");
      successCB()
      successAlert("Confirmation sent. Click the link in your new email to update.")
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleUpdateEmail= request error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReauthenticate = async ({ password = "", setIsLoading = (_: boolean) => {} }) => {
    if (!authUser || !authUser.email) return
    setIsLoading(true)
    try {
      const credential = EmailAuthProvider.credential(authUser.email, password)
      await reauthenticateWithCredential(authUser, credential)
      successAlert("reauthenticated successfully")
      console.log("reauthenticated successfully")
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.")
      console.error(err, "=handleReauthenticate= request error")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleSignUp,
    handleSignIn,
    handleSignInWithGoogle,
    handleSignOut,
    handleLinkEmailPasswordAccount,
    handleResetPassword,
    handleUpdatePassword,
    handleUpdateEmail,
    handleReauthenticate,
  }
}
