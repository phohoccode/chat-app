import { createContext, useCallback, useState } from "react";
import React, { ReactNode } from "react";

interface AuthContextType {
  user: {
    name: string;
  } | null;
  registerInfo: RegisterInfo | null;
  setUser: (user: { name: string }) => void;
  setRegisterInfo: (registerInfo: RegisterInfo) => void;
  updateRegisterInfo: (info: RegisterInfo) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo | null>({
    name: "",
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        setUser,
        setRegisterInfo,
        updateRegisterInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
