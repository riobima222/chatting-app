import React, { createContext, useState } from "react";

export const TriggerContext = createContext({});

const TriggerProvider = ({ children }: { children: React.ReactNode }) => {
  const [trigger, setTrigger] = useState(false);

  return (
    <TriggerContext.Provider value={{ trigger, setTrigger }}>
      {children}
    </TriggerContext.Provider>
  );
};

export default TriggerProvider;
