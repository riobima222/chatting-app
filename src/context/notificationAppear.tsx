import React, { createContext, useState } from "react";

export const NotificationAppearContext = createContext({});

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationAppear, setNotificationAppear] = useState(false);

  return (
    <NotificationAppearContext.Provider
      value={{ notificationAppear, setNotificationAppear }}
    >
      {children}
    </NotificationAppearContext.Provider>
  );
};

export default NotificationProvider;
