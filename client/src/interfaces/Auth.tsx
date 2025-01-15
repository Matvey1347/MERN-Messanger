import { FormEvent } from "react"

export interface RegisterInfo {
  name: string,
  email: string,
  password: string
}

export interface LoginInfo {
  email: string,
  password: string
}

export interface User {
  email: string,
  name: string,
  token: string,
  _id: string
}

export interface AuthContextParams {
  user: User | null,
  registerInfo: RegisterInfo,
  registerError: string,
  isRegisterLoading: boolean,
  loginInfo: LoginInfo,
  loginError: string,
  isLoginLoading: boolean,
  setRegisterInfo: (info: RegisterInfo) => void,
  setLoginInfo: (info: LoginInfo) => void,
  registerUser: (e: FormEvent) => void,
  logoutUser: () => void,
  loginUser: (e: FormEvent) => void,
}