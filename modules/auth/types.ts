export type SignInData = { email: string; password: string }

export type SignUpData = { name: ""; email: ""; password: ""; repeatPassword: "" }

export type ResetPasswordData = { email: '' }

export type UpdateEmailData = { email: '' }

export type AddPasswordData = { password: "", repeatPassword: "" }

export type UpdatePasswordData = { oldPassword: "", password: "", repeatPassword: "" }