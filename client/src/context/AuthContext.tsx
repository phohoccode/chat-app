import { createContext, useCallback, useEffect, useState } from "react";
import React, { ReactNode } from "react";
import { baseUrl, postRequest } from "../utils/services";

export interface User {
  name: string;
  email: string;
  token: string;
  _id: string;
}
export interface AuthContextType {
  user?: User | null;
  registerInfo?: RegisterInfo | null;
  loginInfo?: LoginInfo | null;
  isRegisterLoading?: boolean;
  isLoginLoading?: boolean;
  registerError?: string | null;
  loginError?: string | null;
  setUser?: (user: User) => void;
  setRegisterInfo?: (registerInfo: RegisterInfo) => void;
  updateRegisterInfo?: (info: RegisterInfo) => void;
  updateLoginInfo?: (info: LoginInfo) => void;
  registerUser?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  loginUser?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  logoutUser?: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface LoginInfo {
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo | null>({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("User");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo
      );

      setIsRegisterLoading(false);

      if (response.error) {
        setRegisterError(response);
        return;
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(`${baseUrl}/users/login`, loginInfo);

      setIsLoginLoading(false);

      if (response.error) {
        setLoginError(response);
        return;
      }

      localStorage.setItem("User", JSON.stringify(response));

      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        loginInfo,
        isRegisterLoading,
        isLoginLoading,
        registerError,
        loginError,
        setUser,
        registerUser,
        setRegisterInfo,
        updateRegisterInfo,
        updateLoginInfo,
        logoutUser,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
