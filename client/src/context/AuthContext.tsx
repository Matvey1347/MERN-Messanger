import { createContext, FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContextParams, LoginInfo, RegisterInfo } from "../interfaces/Auth";
import { baseUrl, postRequest } from "../utils/services";

const defRegisterValue = {
  name: '',
  email: '',
  password: ''
}

const defLoginValue = {
  email: '',
  password: ''
}

export const AuthContext = createContext<AuthContextParams>({
  setRegisterInfo: () => { },
  setLoginInfo: () => { },
  registerUser: () => { },
  loginUser: () => { },
  logoutUser: () => { },
  user: getUserFromStorage(),
  registerInfo: defRegisterValue,
  registerError: "",
  isRegisterLoading: false,
  loginInfo: defLoginValue,
  loginError: "",
  isLoginLoading: false,
});

function getUserFromStorage() {
  const user = localStorage.getItem("User");
  return user ? JSON.parse(user) : {};
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegsiterError] = useState<string>("");
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>(defRegisterValue);

  const [loginError, setLoginError] = useState<string>("");
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>(defLoginValue);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const registerUser = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegsiterError("");
    const res = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
    const error = res.error;

    setIsRegisterLoading(false);

    if (error) {
      return setRegsiterError(res.message);
    }

    localStorage.setItem("User", JSON.stringify(res.data));
    setUser(res.data);
  }, [registerInfo]);

  const loginUser = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    const res = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
    const error = res.error;

    setIsLoginLoading(false);

    if (error) {
      return setLoginError(res.message);
    }

    localStorage.setItem("User", JSON.stringify(res.data));
    setUser(res.data);
  }, [loginInfo]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, [])

  return <AuthContext.Provider value={{
    user,
    registerInfo,
    setRegisterInfo,
    setLoginInfo,
    registerUser,
    registerError,
    isRegisterLoading,
    logoutUser,
    loginUser,
    loginInfo,
    loginError,
    isLoginLoading
  }}>
    {children}
  </AuthContext.Provider>;
};