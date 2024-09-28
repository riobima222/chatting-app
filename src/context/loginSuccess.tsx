import React, { createContext, useState } from "react";

export const LoginSuccessContext = createContext({});

const LoginSuccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginSuccess, setLoginSuccess] = useState(false);

  return (
    <LoginSuccessContext.Provider value={{ loginSuccess, setLoginSuccess }}>
      {children}
    </LoginSuccessContext.Provider>
  );
};

export default LoginSuccessProvider;
