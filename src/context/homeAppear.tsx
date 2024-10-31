import React, { createContext, useState } from "react";

export const HomeAppearContext = createContext({});

const HomeAppearProvider = ({ children }: { children: React.ReactNode }) => {
  const [homeAppear, setHomeAppear] = useState(true);

  return (
    <HomeAppearContext.Provider value={{ homeAppear, setHomeAppear }}>
      {children}
    </HomeAppearContext.Provider>
  );
};

export default HomeAppearProvider;
