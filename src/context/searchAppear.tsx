import React, { createContext, useState } from "react";

export const SearchAppearContext = createContext({});

const SearchAppearProvider = ({ children }: { children: React.ReactNode }) => {
  const [ searchAppear, setSearchAppear] = useState(true);

  return (
    <SearchAppearContext.Provider value={{ searchAppear, setSearchAppear }}>
      {children}
    </SearchAppearContext.Provider>
  );
};

export default SearchAppearProvider;